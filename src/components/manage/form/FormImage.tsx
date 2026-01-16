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
}

const FormImage = ({
  label,
  fallbackUrl,
  onBlur,
  value: file,
  onChange,
  helperText,
  className,
}: FormImageProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : fallbackUrl;

  return (
    <div className={className}>
      <div className="w-full lg:h-96 max-lg:h-48 flex flex-col justify-center items-center gap-2 p-8 rounded-md bg-cornflower-50 dark:bg-cornflower-950 has-[:hover]:bg-cornflower-100 dark:has-[:hover]:bg-cornflower-900 transition-colors relative">
        {label && (
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {label}
          </p>
        )}
        {previewUrl ? (
          <>
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Preview image"
                className="max-h-full rounded-lg"
              />
            )}
            {file?.name && (
              <p className="text-xs text-slate-800 dark:text-slate-200">
                {file.name}
              </p>
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
