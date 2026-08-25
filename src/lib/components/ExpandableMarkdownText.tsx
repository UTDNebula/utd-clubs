'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import MarkdownText from './MarkdownText';

const ExpandableMarkdownText = ({
  text,
  maxLines,
}: {
  text: string;
  maxLines: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const content = container.firstElementChild as HTMLElement;
    if (content) {
      setIsOverflowing(content.scrollHeight > content.offsetHeight); // scrollHeight is the total height, offsetHeight is the visible height
    }
  }, [text, maxLines]);

  return (
    <div className="flex flex-col [&_.prose]:max-w-none" ref={containerRef}>
      <MarkdownText text={text} expanded={expanded} maxLines={maxLines} />
      {/* Read more / Read less */}
      {isOverflowing && (
        <button
          type="button"
          className="text-royal dark:text-cornflower-300 hover:text-royalDark dark:hover:text-cornflower-400 mt-4 -mb-4 self-end text-[13px] font-medium underline decoration-transparent transition hover:decoration-inherit md:mt-2 md:mb-0 md:self-start md:text-sm"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default ExpandableMarkdownText;
