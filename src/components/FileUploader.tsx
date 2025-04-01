
import React, { useState } from 'react';
import { validateFileSize, uploadImageToSupabase } from '@/lib/supabase-helpers';
import { X, Upload, Check } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (url: string) => void;
  defaultImageUrl?: string;
  bucket: string;
  label?: string;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  defaultImageUrl, 
  bucket,
  label,
  className 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImageUrl || null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileSize(file)) {
      setError('File size exceeds the maximum limit of 5MB');
      return;
    }

    // Create a local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    setIsUploading(true);
    setError(null);
    
    try {
      const imageUrl = await uploadImageToSupabase(file, bucket);
      if (imageUrl) {
        onFileUpload(imageUrl);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setError(null);
    onFileUpload('');
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {previewUrl ? (
          <div className="relative rounded-md overflow-hidden border border-input">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-40 object-cover"
            />
            <button
              type="button"
              onClick={handleReset}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white p-2 rounded-full">
                  <Check className="text-green-500" size={24} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
              {isUploading && <p className="text-xs text-blue-500 mt-2">Uploading...</p>}
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              disabled={isUploading}
            />
          </label>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default FileUploader;
