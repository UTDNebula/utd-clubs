import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const MarkdownText = ({ text }: { text: string }) => {
  return (
    <div className="prose prose-slate dark:prose-invert prose-a:text-royal dark:prose-a:text-cornflower-300 prose-ul:[&.contains-task-list]:list-none prose-ul:[&.contains-task-list]:pl-2">
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
