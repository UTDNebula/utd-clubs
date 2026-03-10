'use client';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import Chip, { ChipProps } from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import { ReactNode, useState } from 'react';

type FilterChipProps = ChipProps & {
  label?: ReactNode;
  /**
   * Component to be displayed as a popover when clicking on the chip.
   * NOTE: Will forcibly enable the {@linkcode FilterChipProps.disableDelete | disableDelete} prop.
   */
  popoverComponent?: ReactNode;
  /**
   * Prevents the filter chip from being used to delete the filter
   * @default false
   */
  disableDelete?: boolean;
};

export default function FilterChip({
  className,
  label,
  popoverComponent,
  disableDelete,
  onDelete,
  ...props
}: FilterChipProps) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const openPopover = Boolean(popoverAnchorEl);

  const handleOpenPopover = (e: React.MouseEvent<HTMLDivElement>) => {
    setPopoverAnchorEl(e.currentTarget);
  };

  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    onDelete?.(e);
  };

  return (
    <>
      <Chip
        variant="filled"
        label={
          <span className="flex justify-center gap-3">
            {label}
            {popoverComponent ? (
              <ArrowDropDownIcon
                fontSize="small"
                className="-ml-1.5 mr-1.25 fill-[rgba(var(--mui-palette-text-primaryChannel)/0.26)] group-hover/chip:fill-[rgba(var(--mui-palette-text-primaryChannel)/0.4)]"
              />
            ) : disableDelete ? undefined : (
              <ClearIcon
                fontSize="small"
                className="-ml-1.5 mr-1.25 fill-[rgba(var(--mui-palette-text-primaryChannel)/0.26)] group-hover/chip:fill-[rgba(var(--mui-palette-text-primaryChannel)/0.4)]"
              />
            )}
          </span>
        }
        className={`group/chip ${className}`}
        onClick={
          popoverComponent
            ? handleOpenPopover
            : disableDelete
              ? undefined
              : handleDelete
        }
        slotProps={{
          label: {
            className: `${popoverComponent || !disableDelete ? 'pr-0' : ''}`,
          },
        }}
        {...props}
      />
      <Popover
        open={openPopover}
        onClose={handleClosePopover}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        slotProps={{
          paper: { className: 'rounded-lg' },
        }}
      >
        {popoverComponent}
      </Popover>
    </>
  );
}
