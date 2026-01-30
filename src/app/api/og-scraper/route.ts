import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'bot-crawler', 
      },
    });

    if (!response.ok) throw new Error('Failed to fetch site');

    const html = await response.text();

    // Find: <meta property="og:image" content="...">
    let imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);

    // Looks for name="twitter:image" as a fallback
    if (!imageMatch) {
      imageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    }

    const ogImage = imageMatch ? imageMatch[1] : null;

    return NextResponse.json({ ogImage });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape' }, { status: 500 });
  }
}