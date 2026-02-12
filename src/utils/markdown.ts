import { remark } from 'remark';
import strip from 'strip-markdown';

export function convertMarkdownToPlaintext(md: string): string {
  const processor = remark().use(strip);

  const tree = processor.parse(md);
  const transformedTree = processor.runSync(tree);
  const result = processor.stringify(transformedTree);

  return result;
}
