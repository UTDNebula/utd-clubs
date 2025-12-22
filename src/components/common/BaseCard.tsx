type CardVariant = 'flat' | 'interactive';

type BaseCardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  id?: string;
};

const baseClasses = 'rounded-lg';

const variantClasses: Record<CardVariant, string> = {
  flat: 'shadow-none',
  interactive: 'shadow-lg transition-all hover:shadow-xl',
};

export const BaseCard = ({
  children,
  variant = 'flat',
  className = '',
  id = '',
}: BaseCardProps) => {
  const hasBgClass = className.includes('bg-');
  return (
    <div
      id={id}
      className={`${baseClasses} ${hasBgClass ? '' : 'bg-white'} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
