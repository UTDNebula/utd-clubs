'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FormImageProps {
  label?: string;
  value: File | null;
  fallbackUrl?: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormImage = ({
  label,
  fallbackUrl,
  onBlur,
  value: file,
  onChange,
}: FormImageProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : fallbackUrl;

  return (
    <div className="w-full h-full max-h-96 flex flex-col justify-center items-center gap-2 p-8 rounded-md bg-royal/10 has-[:hover]:bg-royal/20 transition-colors relative">
      {label && <p className="text-xs font-bold text-slate-700">{label}</p>}
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
        onChange={onChange}
        className="absolute inset-0 cursor-pointer text-transparent"
      />
    </div>
  );
};

export default FormImage;
