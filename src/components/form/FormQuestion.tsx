import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type FormQuestionProps = {
  children: ReactNode;
  question?: string;
};

export default function FormQuestion({
  children,
  question,
}: FormQuestionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Typography variant="body1">{question}</Typography>
      </div>
      <div className="flex flex-wrap gap-6 w-full">{children}</div>
    </div>
  );
}
