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
          className="-mb-4 md:mb-0 mt-4 md:mt-2 text-[13px] md:text-sm self-end md:self-start font-medium text-royal dark:text-cornflower-300 hover:text-royalDark dark:hover:text-cornflower-400 underline decoration-transparent hover:decoration-inherit transition"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default ExpandableMarkdownText;
