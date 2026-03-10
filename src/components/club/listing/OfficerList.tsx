'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Panel from '@src/components/common/Panel';
import { SelectOfficer } from '@src/server/db/models';
import ClubOfficer from './ClubOfficer';

export default function OfficerList({
  officers,
  id,
}: {
  officers: SelectOfficer[];
  id?: string;
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
      const officerContainer = document.getElementById(
        id || 'officer-card-wrapper',
      ); // Finds the card wrapper

      if (!rightSide || !officerContainer || !contentRef.current) return;

      const rightBottom = rightSide.getBoundingClientRect().bottom;
      const officerTop = officerContainer.getBoundingClientRect().top;

      // The height of the officer card at start should be the distance between officer's top and the right side's bottom
      const targetHeight = rightBottom - officerTop; // will be negative in mobile -> sets truncation to true, but maxHeight is default 300px
      const contentHeight = contentRef.current.scrollHeight + 80; // height of the full officer card + padding/header space
      setMaxHeight(Math.max(targetHeight, 230)); // at least 230px to show 2 officers
      setNeedsTruncation(contentHeight > targetHeight && officers.length > 0); // if no officers, no truncation -- just show error text
    };

    updateHeight(); // initial measure

    // re-measure if the window is resized or description expands
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rightSide);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [officers, id]);

  return (
    <Panel
      className="text-sm"
      slotClassNames={{ collapse: 'relative' }}
      id={id}
      smallPadding
      heading="Officers"
      enableCollapsing={
        needsTruncation
          ? {
              toggleOnHeadingClick: true,
              collapsedSize: maxHeight ?? undefined,
            }
          : false
      }
      collapse={needsTruncation && !isExpanded}
      onCollapseClick={() => setIsExpanded((prev) => !prev)}
    >
      <div className="flex-1 min-h-0 overflow-hidden">
        <div ref={contentRef} className="flex flex-col gap-4">
          {officers.length > 0 ? (
            officers.map((officer) => (
              <ClubOfficer key={officer.name} officer={officer} />
            ))
          ) : (
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              No officers listed
            </span>
          )}
        </div>
      </div>

      {needsTruncation && (
        <div
          className={`${needsTruncation && !isExpanded ? 'absolute' : ''} bottom-0 left-0 w-full`}
        >
          {/* fade overlay only shows if content is taller than right side AND not expanded */}
          {!isExpanded && (
            <div className="h-16 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
          )}
          <div className="bg-white dark:bg-neutral-900 pt-2 border-t border-slate-300 dark:border-slate-700 z-10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-sm font-semibold text-royal dark:text-cornflower-300 hover:text-royalDark dark:hover:text-cornflower-400 underline decoration-transparent hover:decoration-inherit transition text-center"
            >
              {isExpanded ? 'Show less' : 'See all officers'}
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}
