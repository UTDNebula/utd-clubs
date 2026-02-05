'use client';

import { ChevronRight } from '@mui/icons-material';
import { Collapse, IconButton, Skeleton, Typography } from '@mui/material';
import React, { useState, type ReactNode } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';

type CollapseOptions = {
  /**
   * Whether to show the collapse button
   * @default true
   */
  showIcon?: boolean;
  /**
   * Side the collapse button shows on
   * @default "right"
   */
  iconPosition?: 'left' | 'right';
  /**
   * Whether the panel is collapsed on first render
   * @default "open"
   */
  defaultState?: 'collapsed' | 'open';
  /**
   * Whether clicking on the heading should toggle collapsing the panel
   * @default false
   */
  toggleOnHeadingClick?: boolean;
};

interface PanelPropsBase {
  heading?: ReactNode;
  description?: ReactNode;
  startAdornment?: React.JSX.Element;
  endAdornment?: React.JSX.Element;
  smallPadding?: boolean;
  /**
   * Control whether the panel is collapsed
   * NOTE: This makes this a controlled component
   */
  collapse?: boolean;
  /**
   * If present, enables features that allow for collapsing the panel.
   * Can be provided with an object of options to customize the collapsing features
   * @default false
   */
  enableCollapsing?: boolean | CollapseOptions;
  /**
   * Callback function called whenever collapse button is pressed
   */
  onCollapseClick?: () => void;
  /**
   * Callback function called whenever headiing is clicked
   * NOTE: If prop is provided, the heading gwill turn the cursor to a pointer
   */
  onHeadingClick?: () => void;
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
  collapse,
  enableCollapsing = false,
  onCollapseClick,
  onHeadingClick,
  className,
  style,
  id,
}: PanelProps) => {
  const collapseOptions: CollapseOptions = {
    showIcon: true,
    iconPosition: 'right',
    defaultState: 'open',
    toggleOnHeadingClick: false,
    ...(typeof enableCollapsing !== 'boolean' ? enableCollapsing : undefined),
  };

  const [collapsed, setCollapsed] = useState(
    collapseOptions.defaultState === 'collapsed' ? true : false,
  );

  const CollapseButton = (
    <IconButton
      onClick={() => {
        setCollapsed((prev) => !prev);
        onCollapseClick?.();
      }}
    >
      <ChevronRight
        className={`transition-transform ${collapsed || collapse ? 'rotate-0' : 'rotate-90'}`}
      />
    </IconButton>
  );

  return (
    <BaseCard
      className={`flex flex-col ${smallPadding ? 'p-5' : 'sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4'} min-w-0 max-w-6xl
        ${className ?? ''}`}
      {...(id ? { id } : {})}
      style={style}
    >
      {(startAdornment || heading || endAdornment || enableCollapsing) && (
        <div
          className={`flex justify-between ${collapseOptions.toggleOnHeadingClick || onHeadingClick ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (collapseOptions.toggleOnHeadingClick) {
              setCollapsed((prev) => !prev);
            }
            onHeadingClick?.();
          }}
        >
          <div className="flex">
            {enableCollapsing &&
              collapseOptions.showIcon &&
              collapseOptions.iconPosition === 'left' &&
              CollapseButton}
            <div
              className={`flex items-center gap-2 ml-2 ${smallPadding ? '' : 'ml-2'}`}
            >
              {startAdornment}
              {heading && (
                <Typography variant="h2" className="text-xl font-bold">
                  {heading}
                </Typography>
              )}
              {endAdornment}
            </div>
          </div>
          {enableCollapsing &&
            collapseOptions.showIcon &&
            collapseOptions.iconPosition === 'right' &&
            CollapseButton}
        </div>
      )}
      <Collapse in={!(collapsed || collapse)}>
        {/* The `pt-2` class must be a child of `<Collapse />` so that the padding also collapses*/}
        <div className="pt-2">
          {description && (
            <div
              className={`mb-4 text-slate-600 dark:text-slate-400 text-sm ${smallPadding ? '' : 'ml-2'}`}
            >
              {description}
            </div>
          )}
          {children}
        </div>
      </Collapse>
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
