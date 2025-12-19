'use client';

import { useState } from 'react';
import MarkdownText from './MarkdownText';

const ExpandableMarkdownText = ({ text, maxLines }: { text: string, maxLines: number }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className='[&_.prose]:max-w-none'>
      <MarkdownText text={text} expanded={expanded} maxLines={maxLines} />
      {/* Read more / Read less */}
      <button
        type="button"
        className="mt-2 text-sm font-medium text-royal hover:underline"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
};

export default ExpandableMarkdownText;
