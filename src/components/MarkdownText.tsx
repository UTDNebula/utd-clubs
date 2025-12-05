import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

const MarkdownText = ({ text }: { text: string }) => {
  return (
    <div className="prose prose-slate prose-a:text-royal prose-ul:[&.contains-task-list]:list-none prose-ul:[&.contains-task-list]:pl-2">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeExternalLinks, { rel: ['noreferrer'], target: ['_blank'] }],
        ]}
      >
        {text}
      </Markdown>
    </div>
  );
};

export default MarkdownText;
