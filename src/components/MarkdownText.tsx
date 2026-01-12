import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const MarkdownText = ({
  text,
  expanded = true,
  maxLines = 3,
}: {
  text: string;
  expanded?: boolean;
  maxLines?: number;
}) => {
  return (
    <div
      className={`prose prose-slate prose-a:text-royal prose-ul:[&.contains-task-list]:list-none prose-ul:[&.contains-task-list]:pl-2 transition-all prose-sm md:prose-base
    ${expanded ? '' : 'line-clamp-3'}`}
      style={!expanded ? { WebkitLineClamp: maxLines } : undefined}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeExternalLinks, { rel: ['noreferrer'], target: ['_blank'] }],
          rehypeSanitize,
        ]}
      >
        {text}
      </Markdown>
    </div>
  );
};

export default MarkdownText;
