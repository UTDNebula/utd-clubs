"use client"
import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import MarkdownText from './MarkdownText';
import { useState } from 'react';

const ExpandableMarkdownText = ({ text } : { text: string }) => {
    const [expanded, setExpanded] = useState(false);
  return (
    <>
        <MarkdownText text={text} expanded={expanded} />
        {/* Read more / Read less */}
        <button
            type="button"
            className="mt-2 text-sm font-medium text-royal hover:underline"
            onClick={() => setExpanded((v) => !v)}
        >
            {expanded ? 'Read less' : 'Read more'}
        </button>
    </>
  );
};

export default ExpandableMarkdownText;
