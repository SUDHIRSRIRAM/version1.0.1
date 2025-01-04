import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { UploadSection } from "./image-processor/UploadSection";
import { ResultSection } from "./image-processor/ResultSection";
import { ImageEditor } from "./image-processor/ImageEditor";
import { Card, CardContent } from "./ui/card";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [highQualityBlob, setHighQualityBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setProcessedImage(null);
      setIsEditing(false);

      // Process image with high quality settings
      const result = await removeBackground(file, {
        progress: (args_0: string, args_1: number) => {
          setProgress(Math.round(args_1 * 100));
        },
        model: "medium",
        output: {
          quality: 1.0, // Maximum quality
          type: "image/png",
        }
      });

      // Store the high quality blob for later download
      setHighQualityBlob(result);

      // Create preview URL
      const processedImageUrl = URL.createObjectURL(result);
      setProcessedImage(processedImageUrl);
      
      toast({
        title: "Success!",
        description: "Background removed successfully",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDelete = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setHighQualityBlob(null);
    setProgress(0);
    setIsEditing(false);
    toast({
      title: "Deleted",
      description: "Image has been removed",
    });
  };

  const handleDownload = () => {
    if (!highQualityBlob) return;
    
    try {
      // Create a high-quality PNG from the blob
      const downloadUrl = URL.createObjectURL(highQualityBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "processed-image-hq.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl); // Clean up the URL

      toast({
        title: "Success",
        description: "High quality image downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  if (isEditing && processedImage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <ImageEditor
                image={processedImage}
                onBack={() => setIsEditing(false)}
                onSave={(editedImage) => {
                  // Convert base64 to blob for high quality storage
                  fetch(editedImage)
                    .then(res => res.blob())
                    .then(blob => {
                      setHighQualityBlob(blob);
                      setProcessedImage(editedImage);
                      setIsEditing(false);
                      toast({
                        title: "Success",
                        description: "Image edited successfully",
                      });
                    });
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Remove Background from Images
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Upload your image and we'll automatically remove the background for you
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {!originalImage ? (
              <UploadSection onUpload={handleImageUpload} onDrop={handleDrop} />
            ) : (
              <ResultSection
                originalImage={originalImage}
                processedImage={processedImage}
                isProcessing={isProcessing}
                progress={progress}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onEdit={() => setIsEditing(true)}
                setIsEditing={setIsEditing}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};