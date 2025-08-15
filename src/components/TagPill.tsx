'use client';
import { useSearchStore } from '@src/utils/SearchStoreProvider';

export const TagPill = ({ name }: { name: string }) => {
  const addTag = useSearchStore((state) => state.addTag);
  return (
    <button
      className="bg-blue-primary rounded-xl px-2 text-sm font-bold transition-colors hover:bg-blue-700"
      onClick={() => addTag(name)}
      type="button"
    >
      # {name}
    </button>
  );
};
