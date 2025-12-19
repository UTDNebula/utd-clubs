'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { RouterOutputs } from '@src/trpc/shared';
import ClubOfficer from './ClubOfficer';

export default function OfficerList({
  officers,
}: {
  officers: NonNullable<RouterOutputs['club']['getDirectoryInfo']>['officers'];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rightSide = document.getElementById('club-content-right');
    if (!rightSide || !contentRef.current) return;

    const updateHeight = () => {
      const rightSide = document.getElementById('club-content-right');
      const officerContainer = contentRef.current?.closest('.bg-slate-100'); // Finds the card wrapper

      if (!rightSide || !officerContainer || !contentRef.current) return;

      // 1. Get the page position of the bottom of the right column
      const rightBottom = rightSide.getBoundingClientRect().bottom;

      // 2. Get the page position of the top of the Officer Card
      const officerTop = officerContainer.getBoundingClientRect().top;

      // 3. The height of the card should be the distance between its top and the right side's bottom
      const targetHeight = rightBottom - officerTop;
      const contentHeight = contentRef.current.scrollHeight + 80; // + padding/header space
      setMaxHeight(targetHeight > 0 ? targetHeight : 300);
      setNeedsTruncation(contentHeight > targetHeight && officers.length > 0);
    };

    // Initial measure
    updateHeight();

    // Re-measure if the window is resized or description expands
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rightSide);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [officers]);

  // Determine the CSS height
  const containerStyle =
    isExpanded || !needsTruncation
      ? { height: 'auto' }
      : maxHeight
        ? { height: `${maxHeight}px` }
        : { height: 'auto' };

  return (
    <div
      className="flex flex-col gap-2 bg-slate-100 p-4 rounded-xl transition-all duration-500 overflow-hidden"
      style={containerStyle}
    >
      <h2 className="text-2xl font-semibold mb-2">Officers</h2>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div ref={contentRef} className="flex flex-col gap-4">
          {officers.length > 0 ? (
            officers.map((officer) => (
              <ClubOfficer key={officer.name} officer={officer} />
            ))
          ) : (
            <span className="text-slate-500 text-sm">Stay tuned...</span>
          )}
        </div>

        {/* fade overlay only shows if content is taller than right side AND not expanded */}
        {needsTruncation && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
        )}
      </div>

      {needsTruncation && (
        <div className="mt-2 pt-2 border-t border-slate-300 z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-sm font-semibold text-blue-400 hover:text-blue-600 text-center"
          >
            {isExpanded ? 'Show less' : 'See all officers'}
          </button>
        </div>
      )}
    </div>
  );
}
