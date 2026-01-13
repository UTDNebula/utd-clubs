'use client';

import { useSearchStore } from '@src/utils/SearchStoreProvider';
import { TagChip } from './common/TagChip';

export const TagPill = ({
  name,
  removeTag,
  className,
}: {
  name: string;
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
  );
};
