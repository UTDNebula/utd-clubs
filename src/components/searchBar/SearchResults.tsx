import { Skeleton } from '@mui/material';
import { type PropsWithChildren, type ReactElement } from 'react';

interface SearchResultsProps {
  searchResults: ReactElement<SearchResultsItemProps>[];
  isLoadingResults?: boolean;
  hasResults?: boolean;
  isVisible?: boolean;
}

const SearchResultsItemSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 px-4 py-2">
      <Skeleton 
        variant="text" 
        width="70%" 
        height={24}
        sx={{ bgcolor: 'grey.300' }}
      />
    </div>
  );
};

export const SearchResults = ({ 
  searchResults, 
  isLoadingResults = false,
  hasResults = false,
  isVisible = true
}: SearchResultsProps) => {
  // Determine how many skeletons to show (use existing results length or default to 5)
  const skeletonCount = searchResults.length > 0 ? searchResults.length : 5;

  return (
    <div 
      className={`absolute top-full right-0 left-0 z-50 mt-1 rounded-xs shadow-lg transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {isLoadingResults ? (
        <>
          {/* Render fixed number of skeleton items to maintain layout height */}
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SearchResultsItemSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      ) : hasResults ? (
        searchResults
      ) : (
        <div className="w-full bg-gray-50 px-4 py-2 text-center text-gray-500">
          No results found
        </div>
      )}
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