import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Trash2, Download, Wand2 } from "lucide-react";
import { Card } from "../ui/card";
import { CountdownTimer } from "../ui/countdown-timer";
import { Spinner } from "../ui/spinner";

interface ResultSectionProps {
  originalImage: string;
  processedImage: string | null;
  isProcessing: boolean;
  progress: number;
  onProcess: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const ResultSection = ({
  originalImage,
  processedImage,
  isProcessing,
  progress,
  onProcess,
  onDelete,
  onDownload,
  onEdit,
  setIsEditing,
}: ResultSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Original Image */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Original Image</h3>
          </div>
          <div className="p-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={originalImage}
                alt="Original"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </Card>

        {/* Processed Image */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Processed Image</h3>
          </div>
          <div className="p-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-full max-w-full object-contain transition-opacity duration-300"
                />
              ) : !isProcessing ? (
                <div className="text-center text-gray-500 p-4">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Upload an image to automatically remove its background</p>
                </div>
              ) : null}
              
              {/* Modern Loading Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all duration-300">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 transition-all duration-300">
                    {/* Spinner */}
                    <div className="relative">
                      <Spinner size="lg" className="text-primary" />
                    </div>
                    
                    {/* Countdown Timer */}
                    <CountdownTimer
                      initialSeconds={20}
                      isRunning={isProcessing}
                      onComplete={() => {
                        // Timer completed - you can add additional actions here if needed
                      }}
                    />
                    
                    {/* Progress Text */}
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Processing your image...
                      </p>
                      <div className="w-48">
                        <Progress value={progress} className="h-1.5 bg-gray-100" />
                      </div>
                      <p className="text-xs font-semibold text-primary">
                        {progress}% Complete
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="destructive"
          onClick={onDelete}
          className="min-w-[200px] h-12"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete
        </Button>

        {processedImage && !isProcessing && (
          <>
            <Button
              onClick={() => {
                onEdit();
                setIsEditing(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Edit Image
            </Button>

            <Button
              onClick={onDownload}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[200px] h-12"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
          </>
        )}
      </div>
    </div>
  );
};