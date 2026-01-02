'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { SelectOfficer } from '@src/server/db/models';
import ClubOfficer from './ClubOfficer';

export default function OfficerList({
  officers,
}: {
  officers: SelectOfficer[];
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
      const officerContainer = document.getElementById('officer-card-wrapper'); // Finds the card wrapper

      if (!rightSide || !officerContainer || !contentRef.current) return;

      const rightBottom = rightSide.getBoundingClientRect().bottom;
      const officerTop = officerContainer.getBoundingClientRect().top;

      // The height of the officer card at start should be the distance between officer's top and the right side's bottom
      const targetHeight = rightBottom - officerTop;
      const contentHeight = contentRef.current.scrollHeight + 80; // height of the full officer card + padding/header space
      setMaxHeight(targetHeight > 300 ? targetHeight : 300); // at least 300px to show 2 officers
      setNeedsTruncation(contentHeight > targetHeight && officers.length > 0); // if no officers, no truncation -- just show error text
    };

    updateHeight(); // initial measure

    // re-measure if the window is resized or description expands
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rightSide);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [officers]);

  // dynamically determine css height in expanded or normal states
  const containerStyle =
    isExpanded || !needsTruncation
      ? { height: 'auto' }
      : maxHeight
        ? { height: `${maxHeight}px` }
        : { height: 'auto' };

  return (
    <div
      id="officer-card-wrapper"
      className="flex flex-col gap-2 bg-neutral-50 shadow-sm p-6 rounded-lg transition-all duration-500 overflow-hidden"
      style={containerStyle}
    >
      <h2 className="text-xl font-bold text-slate-900 mb-2">Officers</h2>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div ref={contentRef} className="flex flex-col gap-4">
          {officers.length > 0 ? (
            officers.map((officer) => (
              <ClubOfficer key={officer.name} officer={officer} />
            ))
          ) : (
            <span className="text-slate-500 text-sm">No officers listed</span>
          )}
        </div>

        {/* fade overlay only shows if content is taller than right side AND not expanded */}
        {needsTruncation && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none" />
        )}
      </div>

      {needsTruncation && (
        <div className="mt-2 pt-2 border-t border-slate-300 z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-sm font-semibold text-royal hover:text-cornflower-800 text-center"
          >
            {isExpanded ? 'Show less' : 'See all officers'}
          </button>
        </div>
      )}
    </div>
  );
}
