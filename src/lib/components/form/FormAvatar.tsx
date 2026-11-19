'use client';

import React, { useEffect, useMemo } from 'react';
import { Avatar, FormHelperText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FormAvatarProps {
  label?: string;
  value: File | null;
  fallbackUrl?: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  className?: string;
}

const FormAvatar = ({
  label,
  fallbackUrl,
  onBlur,
  value: file,
  onChange,
  helperText,
  className,
}: FormAvatarProps) => {
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = objectUrl ?? fallbackUrl;
  const inputId = React.useId();

  return (
    <div className={`flex flex-col items-start gap-2 ${className ?? ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-slate-800 dark:text-slate-200"
        >
          {label}
        </label>
      )}

      <label
        htmlFor={inputId}
        className="group relative cursor-pointer"
      >
        <Avatar
          variant="rounded"
          src={previewUrl}
          alt={label ?? 'Avatar preview'}
          sx={{
            width: { xs: 108, sm: 144 },
            height: { xs: 108, sm: 144 },
            borderRadius: '1.25rem',
          }}
          className="bg-cornflower-50 dark:bg-cornflower-950 transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-cornflower-100 dark:group-hover:bg-cornflower-900 group-active:scale-[0.98]"
        >
          {!previewUrl && (
            <div className="flex flex-col items-center justify-center p-2 text-slate-500 dark:text-slate-400">
              <CloudUploadIcon fontSize="large" />
              <span className="mt-1 text-xs font-bold">Upload</span>
            </div>
          )}
        </Avatar>

        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
          hidden
          onBlur={onBlur}
          onChange={onChange}
        />
      </label>

      {file?.name && (
        <p className="max-w-27 truncate text-xs text-slate-500 dark:text-slate-400 sm:max-w-36">
          {file.name}
        </p>
      )}

      {helperText && (
        <FormHelperText error className="m-0">
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};

export default FormAvatar;