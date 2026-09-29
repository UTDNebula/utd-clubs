import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const MarkdownText = ({
  text,
  expanded = true,
  maxLines = 3,
  fontSize = 'auto',
}: {
  text: string;
  expanded?: boolean;
  maxLines?: number;
  fontSize?: 'auto' | 'small';
}) => {
  return (
    <div
      className={`prose prose-slate dark:prose-invert prose-a:text-royal dark:prose-a:text-cornflower-300 prose-ul:[&.contains-task-list]:list-none prose-ul:[&.contains-task-list]:pl-2 prose-sm ${fontSize === 'auto' ? 'md:prose-base' : ''} transition-all ${expanded ? '' : 'line-clamp-3'}`}
      style={!expanded ? { WebkitLineClamp: maxLines } : undefined}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          [
            rehypeExternalLinks,
            { rel: ['noopener', 'noreferrer'], target: '_blank' },
          ],
        ]}
      >
        {text}
      </Markdown>
    </div>
  );
};

export default MarkdownText;
