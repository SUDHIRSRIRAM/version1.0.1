import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface ImageEditorProps {
  image: string;
  onBack: () => void;
  onSave: (editedImage: string) => void;
}

export const ImageEditor = ({ image, onBack, onSave }: ImageEditorProps) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [activeFeature, setActiveFeature] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  const handleCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        onSave(croppedCanvas.toDataURL());
      }
    }
  };

  const handleRotate = (degree: number) => {
    const newRotation = rotation + degree;
    setRotation(newRotation);
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      cropper.rotateTo(newRotation);
    }
  };

  const handleZoom = (value: number) => {
    setZoom(value);
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      cropper.zoomTo(value);
    }
  };

  const handleFilter = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
          ctx.drawImage(canvas, 0, 0);
          onSave(canvas.toDataURL());
        }
      }
    }
  };

  const handleSave = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        onSave(canvas.toDataURL());
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Edit Image
        </h2>
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            ref={cropperRef}
            src={image}
            style={{ height: '100%', width: '100%' }}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={true}
            preview=".img-preview"
            viewMode={1}
            dragMode="move"
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            background={false}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveFeature('crop')}
                className={`p-4 text-center rounded-lg border ${
                  activeFeature === 'crop'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                Crop
              </button>
              <button
                onClick={() => setActiveFeature('rotate')}
                className={`p-4 text-center rounded-lg border ${
                  activeFeature === 'rotate'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                Rotate
              </button>
              <button
                onClick={() => setActiveFeature('zoom')}
                className={`p-4 text-center rounded-lg border ${
                  activeFeature === 'zoom'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                Zoom
              </button>
              <button
                onClick={() => setActiveFeature('filter')}
                className={`p-4 text-center rounded-lg border ${
                  activeFeature === 'filter'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                Filters
              </button>
            </div>
          </div>

          {activeFeature === 'crop' && (
            <div className="space-y-4">
              <button
                onClick={handleCrop}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Apply Crop
              </button>
            </div>
          )}

          {activeFeature === 'rotate' && (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleRotate(-90)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Rotate Left
                </button>
                <button
                  onClick={() => handleRotate(90)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Rotate Right
                </button>
              </div>
            </div>
          )}

          {activeFeature === 'zoom' && (
            <div className="space-y-4">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => handleZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {activeFeature === 'filter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brightness
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contrast
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={handleFilter}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};