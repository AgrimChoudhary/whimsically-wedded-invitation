
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Image, Upload, X, Check, Loader2 } from 'lucide-react';
import { uploadImageToSupabase, validateFileSize } from '@/lib/supabase-helpers';
import { toast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileUpload: (url: string) => void;
  defaultImageUrl?: string;
  bucket: string;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  defaultImageUrl = '',
  bucket = 'images',
  label = 'Upload an image (Max 5MB)'
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size
    if (!validateFileSize(file)) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Only image files are allowed",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const url = await uploadImageToSupabase(file, bucket);
      
      if (url) {
        setImageUrl(url);
        onFileUpload(url);
        setUploadSuccess(true);
        
        // Reset success indicator after a moment
        setTimeout(() => {
          setUploadSuccess(false);
        }, 2000);
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload the image. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        description: "An error occurred while uploading the image.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl('');
    onFileUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!imageUrl ? (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="p-2 rounded-full bg-gray-100">
            <Image size={24} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xs text-gray-400 mt-1">Click to browse</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img 
            src={imageUrl} 
            alt="Uploaded preview" 
            className="w-full h-48 object-cover" 
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              className="bg-white/90 hover:bg-white"
            >
              <Upload size={16} className="mr-1" />
              Change
            </Button>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
            >
              <X size={16} className="mr-1" />
              Remove
            </Button>
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-white" />
            </div>
          )}
          
          {uploadSuccess && (
            <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
              <Check size={16} className="text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
