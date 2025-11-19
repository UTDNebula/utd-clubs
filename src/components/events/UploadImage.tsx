'use client';

import React, { useRef, useState } from 'react';
import { uploadImage } from 'src/utils/uploadImage';
import { UploadIcon } from '@src/icons/Icons';

interface UploadImageProps {
  clubId: string;
  onUploadComplete?: (imageUrl: string) => void;
}

const UploadImage = ({ clubId, onUploadComplete }: UploadImageProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (selectedFile: File) => {
    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${selectedFile.name}`;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('clubId', clubId);
      formData.append('fileName', fileName);

      const result = await uploadImage(formData);

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadStatus('Upload successful!');

      if (onUploadComplete && result.url) {
        onUploadComplete(result.url);
      }

      setTimeout(() => {
        setUploadStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(
        error instanceof Error
          ? error.message
          : 'Upload failed. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.startsWith('image/')) {
        setUploadStatus('Please select an image file (JPEG, PNG, or SVG).');
        return;
      }

      setFile(selectedFile);
      setUploadStatus(null);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      void uploadFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setUploadStatus(null);

        const objectUrl = URL.createObjectURL(droppedFile);
        setPreviewUrl(objectUrl);

        void uploadFile(droppedFile);
      } else {
        setUploadStatus('Please select an image file (JPEG, PNG, or SVG).');
      }
    }
  };

  const handleBoxClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <p className="mb-4 text-xs font-bold text-[#4D5E80]">
        Drag or choose file to upload
      </p>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/svg+xml"
        disabled={isUploading}
        className="hidden"
      />

      <div
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`upload-box flex h-96 w-full flex-col items-center justify-center gap-6 rounded-md bg-[#E9EAEF] ${
          isUploading
            ? 'opacity-30 cursor-wait'
            : 'opacity-50 hover:opacity-70 cursor-pointer'
        } transition-opacity`}
      >
        {previewUrl ? (
          <div className="relative h-full w-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain rounded-md"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
                <p className="text-white font-bold text-xs">Uploading...</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <UploadIcon />
            <p className="text-xs font-bold text-[#4D5E80]">
              JPEG, PNG, or SVG
            </p>
          </>
        )}
      </div>

      {file && (
        <p className="mt-4 text-xs text-[#4D5E80]">Selected: {file.name}</p>
      )}

      {uploadStatus && (
        <p
          className={`mt-2 text-xs font-bold ${
            uploadStatus.includes('successful')
              ? 'text-green-600'
              : uploadStatus.includes('Uploading')
                ? 'text-blue-600'
                : 'text-red-600'
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UploadImage;
