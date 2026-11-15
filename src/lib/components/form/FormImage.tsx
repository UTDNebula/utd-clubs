'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormHelperText } from '@mui/material';

interface FormImageProps {
  label?: string;
  value: File | null;
  fallbackUrl?: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void | Promise<void>;
  helperText?: string;
  className?: string;
}

const FormImage = ({
  label,
  fallbackUrl,
  onBlur,
  value: file,
  onChange,
  onDelete,
  helperText,
  className,
}: FormImageProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : fallbackUrl;

  return (
    <div className={className}>
      <div className="bg-cornflower-50 dark:bg-cornflower-950 has-[:hover]:bg-cornflower-100 dark:has-[:hover]:bg-cornflower-900 relative flex w-full flex-col items-center justify-center gap-2 rounded-md p-8 transition-colors max-lg:h-48 lg:h-96">
        {label && (
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {label}
          </p>
        )}
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview image"
              className="max-h-full rounded-lg"
            />

            {file?.name && (
              <p className="text-xs text-slate-800 dark:text-slate-200">
                {file.name}
              </p>
            )}
            {previewUrl && (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="text-royal dark:text-cornflower-300 relative z-10 text-sm underline"
              >
                Remove Image
              </button>
            )}
          </>
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
      {helperText && (
        <FormHelperText error className="">
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};

export default FormImage;
