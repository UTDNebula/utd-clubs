type CardVariant = 'flat' | 'interactive';

type BaseCardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
};

const baseClasses = 'rounded-lg';

const variantClasses: Record<CardVariant, string> = {
  flat: 'shadow-sm',
  interactive: 'shadow-lg transition-all hover:shadow-xl',
};

export const BaseCard = ({
  children,
  variant = 'flat',
  className = '',
  style,
  id,
}: BaseCardProps) => {
  const hasBgClass = className.includes('bg-');
  return (
    <div
      {...(id ? { id } : {})}
      style={style}
      className={`${baseClasses} ${hasBgClass ? '' : 'bg-white dark:bg-neutral-900'} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
