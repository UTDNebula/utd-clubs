import { type PropsWithChildren, type ReactElement } from 'react';

interface SearchResultsProps {
  searchResults: ReactElement<SearchResultsItemProps>[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  return (
    <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-xs shadow-lg">
      {searchResults}
    </div>
  );
};

type SearchResultsItemProps = PropsWithChildren<{ onClick: () => void }>;

export const SearchResultsItem = ({
  children,
  onClick,
}: SearchResultsItemProps) => {
  return (
    <button
      type="button"
      className="w-full bg-gray-50 px-4 py-2 text-left font-semibold hover:bg-gray-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
