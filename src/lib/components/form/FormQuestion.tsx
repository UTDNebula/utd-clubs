import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { useFieldContext } from '@/lib/utils/form';

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
  /**
   * Indicates the question is required
   */
  required?: boolean;
  /**
   * Indicates the question's response has an error
   */
  error?: boolean;
};

/**
 * Displays a question above one or multiple form fields.
 * For single form fields, it is recommended to use {@linkcode FieldQuestion} instead.
 */
export default function FormQuestion({
  className,
  children,
  question,
  density = 'full',
  required,
  error,
}: FormQuestionProps) {
  return (
    <div
      className={`flex flex-col ${density === 'full' ? 'gap-6' : 'gap-2'} ${className}`}
    >
      <div className="flex flex-col gap-2">
        {typeof question === 'string' ? (
          <Typography variant="body1" color={error ? 'error' : undefined}>
            {question}
            {required && <span> *</span>}
          </Typography>
        ) : (
          question
        )}
      </div>
      <div className="flex w-full flex-wrap gap-6">{children}</div>
    </div>
  );
}

/**
 * Displays a question above a single form field.
 */
export function FieldQuestion(props: FormQuestionProps) {
  const field = useFieldContext<string>();

  return <FormQuestion error={!field.state.meta.isValid} {...props} />;
}
