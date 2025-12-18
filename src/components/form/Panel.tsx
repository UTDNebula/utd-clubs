import { Box, BoxProps, Skeleton, Typography } from '@mui/material';
import React, { type ReactNode } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';

interface PanelPropsBase {
  heading?: ReactNode;
  startAdornment?: React.JSX.Element;
  endAdornment?: React.JSX.Element;
}

type PanelProps = PanelPropsBase & Omit<BoxProps, keyof PanelPropsBase>;

const Panel = ({
  children,
  heading,
  startAdornment,
  endAdornment,
  ...props
}: PanelProps) => {
  return (
    <BaseCard
      {...props}
      className={`flex flex-col gap-2 sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4 min-w-0 max-w-6xl
        ${props.className ?? ''}`}
    >
      <div className="flex items-center gap-2 ml-2">
        {startAdornment}
        {heading && (
          <Typography variant="h2" className="text-xl font-bold text-haiti">
            {heading}
          </Typography>
        )}
        {endAdornment}
      </div>
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
