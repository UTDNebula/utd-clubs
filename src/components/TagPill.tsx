'use client';

import { Tooltip } from '@mui/material';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import { TagChip } from './common/TagChip';

export const TagPill = ({
  name,
  count,
  removeTag,
  className,
}: {
  name: string;
  count?: number;
  removeTag?: () => void;
  className?: string;
}) => {
  const addTag = useSearchStore((state) => state.addTag);
  const setShouldFocus = useSearchStore((state) => state.setShouldFocus);

  function scroll() {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  }

  return (
    <Tooltip
      title={
        count !== undefined ? `${count} ${count === 1 ? 'club' : 'clubs'}` : ''
      }
    >
      <span>
        <TagChip
          tag={name}
          className={
            'rounded-full font-bold transition-colors ' + (className ?? '')
          }
          onClick={() => {
            addTag(name);
            scroll();
            setShouldFocus(true);
          }}
          onDelete={removeTag}
        />
      </span>
    </Tooltip>
  );
};
