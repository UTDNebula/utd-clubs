'use client';

import React, { useRef, useState } from 'react';
import { uploadToUploadURL } from 'src/utils/uploadImage';
import { UploadIcon } from '@src/icons/Icons';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FormImageProps {
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormImage = ({ onBlur, onChange }: FormImageProps) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      className="normal-case"
    >
      Upload Profile Image
      <VisuallyHiddenInput
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
        onBlur={onBlur}
        onChange={onChange}
      />
    </Button>
  );
};

export async function uploadFile(file: File, clubId: string, type: 'profile' | 'banner') {
  const fileName = `${clubId}-${type}`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);

  const result = await uploadToUploadURL(formData);

  if (result.message !== 'success') {
    throw new Error(result.data);
  }

  return result.data;
};

export default FormImage;
