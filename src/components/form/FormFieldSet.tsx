import Tooltip from '@mui/material/Tooltip';
import { ReactNode } from 'react';

type FormFieldSetProps = {
  children: ReactNode;
  icon?: ReactNode;
  title?: string;
  /**
   * Unique name used for accessibility purposes. Uses {@linkcode FormFieldSetProps.title | title} prop if omitted
   */
  name?: string;
};

export default function FormFieldSet({
  children,
  icon,
  title,
  name,
}: FormFieldSetProps) {
  return (
    <div role="group" aria-label={name ?? title} className="flex gap-4">
      {icon && (
        <Tooltip title={title} className="h-fit">
          <div className="text-neutral-500">{icon}</div>
        </Tooltip>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
