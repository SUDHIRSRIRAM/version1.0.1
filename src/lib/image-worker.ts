// Web Worker for parallel image processing
self.onmessage = (e) => {
  const { mask, width, height } = e.data;
  
  // Process mask data
  const maskData = new Uint8Array(width * height);
  const originalMask = new Uint8Array(mask.data);
  
  // Optimize loop for better performance
  const len = originalMask.length;
  for (let i = 0; i < len; i++) {
    maskData[i] = Math.round((1 - originalMask[i]) * 255);
  }
  
  // Send processed data back to main thread
  self.postMessage(maskData.buffer, [maskData.buffer]);
};
