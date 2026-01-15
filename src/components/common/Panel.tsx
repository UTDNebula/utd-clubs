import { Skeleton, Typography } from '@mui/material';
import React, { type ReactNode } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';

interface PanelPropsBase {
  heading?: ReactNode;
  description?: ReactNode;
  startAdornment?: React.JSX.Element;
  endAdornment?: React.JSX.Element;
  smallPadding?: boolean;
}

interface PanelProps extends PanelPropsBase {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  children?: ReactNode;
}

const Panel = ({
  children,
  heading,
  description,
  startAdornment,
  endAdornment,
  smallPadding = false,
  className,
  style,
  id,
}: PanelProps) => {
  return (
    <BaseCard
      className={`flex flex-col gap-2 ${smallPadding ? 'p-5' : 'sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4'} min-w-0 max-w-6xl
        ${className ?? ''}`}
      {...(id ? { id } : {})}
      style={style}
    >
      {(startAdornment || heading || endAdornment) && (
        <div
          className={`flex items-center gap-2 ${smallPadding ? '' : 'ml-2'}`}
        >
          {startAdornment}
          {heading && (
            <Typography variant="h2" className="text-xl font-bold text-haiti">
              {heading}
            </Typography>
          )}
          {endAdornment}
        </div>
      )}
      {description && (
        <div
          className={`mb-4 text-slate-600 text-sm ${smallPadding ? '' : 'ml-2'}`}
        >
          {description}
        </div>
      )}
      {children}
    </BaseCard>
  );
};

export default Panel;

interface PanelSkeletonProps {
  className?: string;
}

export const PanelSkeleton = (props: PanelSkeletonProps) => {
  return (
    <Skeleton
      className={
        'flex flex-col gap-2 rounded-lg sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4 min-w-0 w-6xl ' +
        props.className
      }
      variant="rounded"
      height={512}
    ></Skeleton>
  );
};
