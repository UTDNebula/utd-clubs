type CardVariant = 'flat' | 'interactive';

type BaseCardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
};

const baseClasses = 'rounded-lg bg-white';

const variantClasses: Record<CardVariant, string> = {
  flat: 'shadow-none',
  interactive: 'shadow-lg transition-shadow hover:shadow-xl',
};

export const BaseCard = ({
  children,
  variant = 'flat',
  className = '',
}: BaseCardProps) => {
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};
