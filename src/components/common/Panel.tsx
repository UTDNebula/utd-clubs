'use client';

import { ChevronRight } from '@mui/icons-material';
import { Collapse, IconButton, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import { usePanelGroup } from './PanelGroup';

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
  /**
   * Minimum height of panel when collapsed, in pixels
   * @default 0
   */
  collapsedSize?: number;
};

interface PanelPropsBase {
  heading?: ReactNode;
  description?: ReactNode;
  startAdornment?: React.JSX.Element;
  endAdornment?: React.JSX.Element;
  smallPadding?: boolean;
  sidebarHeading?: ReactNode;
  /**
   * Control whether the panel is collapsed
   * NOTE: This prop makes the panel a controlled component
   */
  collapse?: boolean;
  /**
   * If present, enables features that allow for collapsing the panel.
   * Can be provided with an object of options to customize the collapsing features
   * @default false
   */
  enableCollapsing?: boolean | CollapseOptions;
  /**
   * Callback function called whenever the collapse button is pressed or if the heading is pressed,
   * so long as the `toggleOnHeadingClick` option for the `enableCollapsing` prop is true
   */
  onCollapseClick?: () => void;
  /**
   * Callback function called whenever heading is clicked
   * NOTE: If this prop is provided, the heading will turn the cursor to a pointer
   */
  onHeadingClick?: () => void;
  /**
   * Whether the panel background should be transparent.
   * @default false
   */
  transparent?: boolean | 'falseOnHover';
}

export interface PanelProps extends PanelPropsBase {
  className?: string;
  slotClassNames?: {
    heading?: string;
    collapse?: string;
    collapseButton?: string;
    description?: string;
  };
  style?: React.CSSProperties;
  id?: string;
  children?: ReactNode;
}

const Panel = (props: PanelProps) => {
  const {
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
    transparent = false,
    className,
    slotClassNames,
    style,
    id,
  } = props;

  const panelRef = useRef<HTMLDivElement>(null);

  const { registerPanel, unregisterPanel } = usePanelGroup();

  // Register panel on mount, then unregister panel on unmount
  useEffect(() => {
    if (props.id) {
      registerPanel({
        props: { ...props, id: props.id },
        // TODO: figure this out
        // ref: panelRef.current === null ? undefined : panelRef,
      });
    }

    return () => {
      if (props.id) {
        unregisterPanel(props.id);
      }
    };
    // Having dependencies causes cascading re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasHeading = Boolean(
    startAdornment || heading || endAdornment || enableCollapsing,
  );

  const collapseOptions: CollapseOptions = {
    showIcon: true,
    iconPosition: 'right',
    defaultState: 'open',
    toggleOnHeadingClick: false,
    collapsedSize: 0,
    ...(typeof enableCollapsing !== 'boolean' ? enableCollapsing : undefined),
  };

  const [collapsed, setCollapsed] = useState(
    collapseOptions.defaultState === 'collapsed' ? true : false,
  );

  const CollapseButton = (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        if (collapse === undefined) {
          setCollapsed((prev) => !prev);
        }
        onCollapseClick?.();
      }}
      className={slotClassNames?.collapseButton}
    >
      <ChevronRight
        className={`transition-transform ${collapsed || collapse ? 'rotate-0' : 'rotate-90'}`}
      />
    </IconButton>
  );

  return (
    <BaseCard
      // Set `scroll-mt-20` to height of BaseHeader plus additional padding
      className={`flex flex-col ${smallPadding ? 'p-5' : 'sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4'} min-w-0 max-w-6xl scroll-mt-20
        target:outline-2 outline-royal dark:outline-cornflower-300 ${transparent === 'falseOnHover' ? 'transition-colors hover:bg-neutral-200 hover:dark:bg-neutral-950' : ''} ${className ?? ''}`}
      {...(id ? { id } : {})}
      style={style}
      ref={panelRef}
      variant={transparent ? 'transparent' : 'flat'}
    >
      {hasHeading && (
        <div
          className={`flex justify-between ${collapseOptions.toggleOnHeadingClick || onHeadingClick ? 'cursor-pointer' : ''} ${slotClassNames?.heading}`}
          onClick={() => {
            if (
              collapseOptions.toggleOnHeadingClick &&
              collapse === undefined
            ) {
              setCollapsed((prev) => !prev);
            }
            onHeadingClick?.();
            onCollapseClick?.();
          }}
        >
          <div className="flex">
            {enableCollapsing &&
              collapseOptions.showIcon &&
              collapseOptions.iconPosition === 'left' &&
              CollapseButton}
            <div
              className={`flex items-center gap-2 min-h-10 ${smallPadding ? '' : 'ml-2'}`}
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
      <Collapse
        in={!(collapsed || collapse)}
        collapsedSize={
          enableCollapsing ? collapseOptions.collapsedSize : undefined
        }
        className={slotClassNames?.collapse}
      >
        <div className={`flex flex-col gap-2 ${hasHeading ? 'pt-2' : ''}`}>
          {description && (
            <div
              className={`mb-4 text-slate-600 dark:text-slate-400 text-sm ${smallPadding ? '' : 'ml-2'} ${slotClassNames?.description}`}
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
