export function convertMarkdownToPlaintext(md : string) {
  return md.replace(/^#+.*$/gm, '') // replace headers
    .replace(/([^.!?])\s*\n+/g, '$1. ') // add periods to end of paragraphs and flatten
    .replace(/\n+/g, ' ') // flatten paragraphs
    .replace(/[*`_]/g, '') // remove text styling
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // use link display text
    .replace(/\s\s+/g, ' ') // clean up extra spaces
    .trim();
}