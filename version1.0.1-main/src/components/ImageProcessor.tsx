import { useState, useCallback, memo, useEffect, useRef } from 'react';
import { UploadSection } from './image-processor/UploadSection';
import { ResultSection } from './image-processor/ResultSection';
import { useToast } from './ui/use-toast';
import { removeBackground } from '@imgly/background-removal';
import imageCompression from 'browser-image-compression';

// Optimal processing settings
const PROCESSING_CONFIG = {
  preview: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.7,
  },
  processing: {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.85,
  }
};

// Create a web worker for image processing
const createWorker = () => {
  const workerCode = `
    self.onmessage = async (e) => {
      const { imageData } = e.data;
      try {
        // Process image data here
        self.postMessage({ success: true, result: imageData });
      } catch (error) {
        self.postMessage({ success: false, error: error.message });
      }
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Utility function to optimize image
const optimizeImage = async (file: File, config: typeof PROCESSING_CONFIG.processing): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    img.onload = () => {
      // Calculate dimensions maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > height) {
        width = Math.min(width, config.maxWidth);
        height = width / aspectRatio;
      } else {
        height = Math.min(height, config.maxHeight);
        width = height * aspectRatio;
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Apply optimization settings
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw image with white background for better processing
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with optimal settings
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          config.quality
        );
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const ImageProcessor = memo(() => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const { toast } = useToast();

  // Initialize web worker
  useEffect(() => {
    workerRef.current = createWorker();
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    try {
      // Clean up previous URLs
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (processedImage) URL.revokeObjectURL(processedImage);

      // Store original file for processing
      setOriginalFile(file);

      // Create quick preview
      const previewBlob = await optimizeImage(file, PROCESSING_CONFIG.preview);
      const previewUrl = URL.createObjectURL(previewBlob);
      
      setOriginalImage(previewUrl);
      setProcessedImage(null);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully!',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    }
  }, [originalImage, processedImage, toast]);

  const handleProcess = useCallback(async () => {
    if (!originalFile || isProcessing) return;

    try {
      setIsProcessing(true);

      // Optimize image for processing
      const optimizedBlob = await optimizeImage(originalFile, PROCESSING_CONFIG.processing);

      // Process the image with optimal settings
      const processedBlob = await removeBackground(optimizedBlob, {
        output: {
          format: 'image/png',
          quality: 0.85,
          type: 'foreground',
        },
        progress: (progress) => {
          console.log('Processing progress:', progress);
        },
      });

      // Create optimized result URL
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
      
      toast({
        title: 'Success',
        description: 'Background removed successfully!',
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process image. Please try again.',
        variant: 'destructive',
      });
      setProcessedImage(null);
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, isProcessing, toast]);

  const handleDelete = useCallback(() => {
    try {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (processedImage) URL.revokeObjectURL(processedImage);
      
      setOriginalImage(null);
      setProcessedImage(null);
      setOriginalFile(null);
      
      toast({
        title: 'Success',
        description: 'Image deleted successfully!',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    }
  }, [originalImage, processedImage, toast]);

  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    try {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'removed-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Success',
        description: 'Image downloaded successfully!',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to download image. Please try again.',
        variant: 'destructive',
      });
    }
  }, [processedImage, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (processedImage) URL.revokeObjectURL(processedImage);
    };
  }, [originalImage, processedImage]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {!originalImage ? (
        <UploadSection 
          onDrop={handleUpload} 
          onUpload={handleUpload} 
        />
      ) : (
        <ResultSection
          originalImage={originalImage}
          processedImage={processedImage}
          onProcess={handleProcess}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
});