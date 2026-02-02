import { Chip } from '@mui/material';
import { MouseEventHandler, ReactElement } from 'react';

interface itemProps {
  className?: string;
  disabled?: boolean;
  'data-item-index'?: number;
  tabIndex?: -1;
  onDelete?: MouseEventHandler<HTMLDivElement>;
}

interface TagChipProps extends itemProps {
  id?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  icon?: ReactElement;
  size?: 'small' | 'medium';
  tag: string;
}

export const TagChip = (props: TagChipProps) => {
  return (
    <Chip
      className={`font-semibold bg-cornflower-100 text-cornflower-600 hover:bg-cornflower-200 dark:bg-cornflower-900 dark:text-cornflower-400 dark:hover:bg-cornflower-800 ${props.className ?? ''}`}
      {...(props.id ? { id: props.id } : {})}
      disabled={props.disabled}
      icon={props.icon}
      size={props.size}
      label={props.tag}
      data-item-index={props['data-item-index']}
      tabIndex={props.tabIndex}
      onClick={props.onClick}
      onDelete={props.onDelete}
      sx={{
        '& .MuiChip-deleteIcon': {
          borderRadius: '50%',
          color: 'var(--color-cornflower-700)',
          '&:hover': {
            color: 'var(--color-cornflower-900)',
          },
        },
      }}
    />
  );
};
