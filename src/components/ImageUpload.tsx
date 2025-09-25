import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, uploadedImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  }, []);

  const handleFiles = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageUpload(file);
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    onImageUpload(null as unknown as File);
  };

  return (
    <div className="w-full">
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50 scale-105'
              : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your avocado image here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG, and WebP files up to 10MB
              </p>
            </div>
            
            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-emerald-200">
            <div className="flex items-start space-x-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Uploaded avocado"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-gray-900 truncate">
                  {uploadedImage.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(uploadedImage.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Image uploaded successfully</span>
                </div>
              </div>
              
              <button
                onClick={removeImage}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;