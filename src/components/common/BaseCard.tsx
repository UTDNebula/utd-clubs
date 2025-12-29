type CardVariant = 'flat' | 'interactive';

type BaseCardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
};

const baseClasses = 'rounded-lg';

const variantClasses: Record<CardVariant, string> = {
  flat: 'shadow-none',
  interactive: 'shadow-lg transition-shadow hover:shadow-xl',
};

export const BaseCard = ({
  children,
  variant = 'flat',
  className = '',
}: BaseCardProps) => {
  const hasBgClass = className.includes('bg-');
  return (
    <div
      className={`${baseClasses} ${hasBgClass ? '' : 'bg-white dark:bg-haiti'} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
