export function addVersionToImage(src: string, version?: number): string {
  if (!version) return src;
  const url = new URL(src);
  url.searchParams.set('v', String(version));
  return url.toString();
}
