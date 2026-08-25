import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type FormQuestionProps = {
  children: ReactNode;
  className?: string;
  /**
   * Text for the question
   */
  question?: string | ReactNode;
  /**
   * Amount of space between the question text and contents
   * @default "full"
   */
  density?: 'full' | 'compact';
};

export default function FormQuestion({
  className,
  children,
  question,
  density = 'full',
}: FormQuestionProps) {
  return (
    <div
      className={`flex flex-col ${density === 'full' ? 'gap-6' : 'gap-2'} ${className}`}
    >
      <div className="flex flex-col gap-2">
        {typeof question === 'string' ? (
          <Typography variant="body1">{question}</Typography>
        ) : (
          question
        )}
      </div>
      <div className="flex w-full flex-wrap gap-6">{children}</div>
    </div>
  );
}
