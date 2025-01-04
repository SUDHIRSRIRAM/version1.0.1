import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for optimal performance
env.allowLocalModels = true;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = navigator.hardwareConcurrency || 4; // Use available CPU cores
env.backends.onnx.wasm.simd = true; // Enable SIMD instructions if available

const MAX_IMAGE_DIMENSION = 1024; // Increased but still optimized
const JPEG_QUALITY = 0.85; // Optimized quality vs size ratio
const MODEL_NAME = 'Xenova/segformer-b0-finetuned-ade-512-512';

// Preload model on module load
const modelPromise = pipeline('image-segmentation', MODEL_NAME, {
  revision: 'main',
  quantized: true // Use quantized model for better performance
});

// Optimized image resizing with proper aspect ratio
function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  const aspectRatio = width / height;
  
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      width = MAX_IMAGE_DIMENSION;
      height = Math.round(width / aspectRatio);
    } else {
      height = MAX_IMAGE_DIMENSION;
      width = Math.round(height * aspectRatio);
    }
  }

  // Use createImageBitmap for hardware-accelerated scaling
  return createImageBitmap(image, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: 'high'
  }).then(bitmap => {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return { width, height };
  });
}

// Worker pool for parallel processing
const workerPool = new Map();
const MAX_WORKERS = Math.max(2, Math.min(4, navigator.hardwareConcurrency || 2));

function getWorker() {
  for (const [worker, busy] of workerPool.entries()) {
    if (!busy) {
      workerPool.set(worker, true);
      return worker;
    }
  }
  
  if (workerPool.size < MAX_WORKERS) {
    const worker = new Worker(new URL('./image-worker.ts', import.meta.url));
    workerPool.set(worker, true);
    return worker;
  }
  
  return null;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  console.time('backgroundRemoval');
  
  try {
    // Get or initialize the model (uses cached version if available)
    const segmenter = await modelPromise;
    
    // Create off-screen canvas with optimized settings
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true,
      desynchronized: true // Reduce latency
    });
    
    if (!ctx) throw new Error('Could not get canvas context');

    // Optimize image size while maintaining aspect ratio
    const { width, height } = await resizeImageIfNeeded(canvas, ctx, imageElement);
    
    // Convert to optimized base64
    const imageData = canvas.convertToBlob({
      type: 'image/jpeg',
      quality: JPEG_QUALITY
    });

    // Run segmentation
    const result = await segmenter(await imageData);
    
    if (!result?.[0]?.mask) {
      throw new Error('Invalid segmentation result');
    }

    // Process mask in parallel using available worker
    const worker = getWorker();
    const maskProcessingPromise = worker ? 
      new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          workerPool.set(worker, false);
          resolve(e.data);
        };
        worker.onerror = reject;
        worker.postMessage({ mask: result[0].mask, width, height });
      }) :
      processMaskInMainThread(result[0].mask, width, height);

    const outputCanvas = new OffscreenCanvas(width, height);
    const outputCtx = outputCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Apply processed mask
    outputCtx.drawImage(canvas, 0, 0);
    const outputImageData = outputCtx.getImageData(0, 0, width, height);
    const processedMask = await maskProcessingPromise;
    
    // Optimize final image composition
    const data = outputImageData.data;
    const mask = new Uint8Array(processedMask);
    
    // Use TypedArrays and optimized loop
    for (let i = 0; i < mask.length; i++) {
      data[i * 4 + 3] = mask[i];
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    console.timeEnd('backgroundRemoval');
    
    // Return optimized PNG for transparency
    return outputCanvas.convertToBlob({
      type: 'image/png'
    });
  } catch (error) {
    console.error('Background removal failed:', error);
    throw error;
  }
};

// Fallback processing for when workers are not available
function processMaskInMainThread(mask: any, width: number, height: number): Uint8Array {
  const maskData = new Uint8Array(width * height);
  const originalMask = new Uint8Array(mask.data);
  
  for (let i = 0; i < originalMask.length; i++) {
    maskData[i] = Math.round((1 - originalMask[i]) * 255);
  }
  
  return maskData;
}

export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}