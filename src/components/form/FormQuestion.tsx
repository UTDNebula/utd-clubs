import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type FormQuestionProps = {
  children: ReactNode;
  /**
   * Text for the question
   */
  question?: string;
  /**
   * Amount of space between the question text and contents
   * @default "full"
   */
  density?: 'full' | 'compact';
};

export default function FormQuestion({
  children,
  question,
  density = 'full',
}: FormQuestionProps) {
  return (
    <div className={`flex flex-col ${density === 'full' ? 'gap-6' : 'gap-2'}`}>
      <div className="flex flex-col gap-2">
        <Typography variant="body1">{question}</Typography>
      </div>
      <div className="flex flex-wrap gap-6 w-full">{children}</div>
    </div>
  );
}
