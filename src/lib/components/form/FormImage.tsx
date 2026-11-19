'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormHelperText } from '@mui/material';

interface FormImageProps {
  label?: string;
  value: File | null;
  fallbackUrl?: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  className?: string;
  aspectRatio?: number;
}

const FormImage = ({
  label,
  fallbackUrl,
  onBlur,
  value: file,
  onChange,
  helperText,
  className,
  aspectRatio,
}: FormImageProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : fallbackUrl;

  return (
    <div className={className}>
      {label && (
        <p className="mb-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          {label}
        </p>
      )}
      <div
        className={`bg-cornflower-50 dark:bg-cornflower-950 has-[:hover]:bg-cornflower-100 dark:has-[:hover]:bg-cornflower-900 has-[:hover]:scale-[1.02] has-[:active]:scale-[0.98] relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[1.25rem] p-8 transition-all duration-200 ${aspectRatio ? '' : 'h-48'}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview image"
            className={
              aspectRatio
                ? 'absolute inset-0 h-full w-full object-cover'
                : 'max-h-full max-w-full rounded-lg'
            }
          />
        ) : (
          <>
            <CloudUploadIcon />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drag or choose a file to upload
            </p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              JPEG, PNG, or SVG
            </p>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
          onBlur={onBlur}
          aria-label="Upload image"
          onChange={onChange}
          className="absolute inset-0 cursor-pointer text-transparent"
        />
      </div>
      {file?.name && (
        <p className="mt-2 max-w-full truncate text-xs text-slate-800 dark:text-slate-200">
          {file.name}
        </p>
      )}
      {helperText && (
        <FormHelperText error className="">
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};

export default FormImage;
