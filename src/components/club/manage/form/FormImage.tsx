'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useEffect, useRef, useState } from 'react';

function isImageType(type: string) {
  return ['image/jpeg', 'image/png', 'image/svg+xml'].includes(type);
}

interface FormImageProps {
  label?: string;
  initialValue: string | null;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormImage = ({
  label,
  initialValue,
  onBlur,
  onChange,
}: FormImageProps) => {
  const storedInitalValueRef = useRef(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValue);

  // Handle reset
  useEffect(() => {
    if (initialValue === storedInitalValueRef.current) {
      setFile(null);
      setPreviewUrl(initialValue);
    }
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageType(file.type)) {
        e.target.value = '';
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setFile(file);
    } else {
      setPreviewUrl(null);
      setFile(null);
    }
    onChange(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (isImageType(file.type)) {
        setPreviewUrl(URL.createObjectURL(file));
        setFile(file);
      }
    }
  };

  return (
    <div className="w-full h-96 flex flex-col justify-center items-center gap-2 p-6 rounded-md bg-royal/10 has-[:hover]:bg-royal/20 transition-colors relative">
      {label && <p className="text-xs font-bold text-slate-700">{label}</p>}
      {file?.name || previewUrl ? (
        <>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview image"
              className="max-h-full rounded-lg"
            />
          )}
          {file?.name && <p className="text-xs text-slate-700">{file.name}</p>}
        </>
      ) : (
        <>
          <CloudUploadIcon />
          <p className="text-xs font-bold text-slate-700">
            Drag or choose a file to upload
          </p>
          <p className="text-xs font-bold text-slate-700">JPEG, PNG, or SVG</p>
        </>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
        onBlur={onBlur}
        onChange={handleChange}
        onDrop={handleDrop}
        className="absolute inset-0 cursor-pointer text-transparent"
      />
    </div>
  );
};

export default FormImage;
