import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@src/server/db';
import { calendarWebhooks } from '@src/server/db/schema/calendarWebhooks';
import { getAuthForClub, syncCalendar } from '@src/utils/calendar';

export async function POST(req: NextRequest) {
  console.log('received gcal sync post');
  const channelId = req.headers.get('x-goog-channel-id');
  const resourceId = req.headers.get('x-goog-resource-id');
  const resourceState = req.headers.get('x-goog-resource-state');
  const token = req.headers.get('x-goog-channel-token');

  if (resourceState === 'sync') return NextResponse.json({ received: true });
  if (!channelId || !resourceId || !token)
    return new NextResponse('Missing headers', { status: 400 });

  const webhook = await db.query.calendarWebhooks.findFirst({
    where: eq(calendarWebhooks.id, channelId),
  });

  if (!webhook) return new NextResponse('Unknown channel', { status: 404 });
  if (webhook.token !== token || webhook.resourceId !== resourceId)
    return new NextResponse('Forbidden', { status: 403 });

  try {
    console.log('gettign auth');
    const auth = await getAuthForClub(webhook.clubId);
    console.log('syncing clubs');
    await syncCalendar(webhook.clubId, false, auth); // sync the calendar
    console.log(`Calendar for ${webhook.clubId} was just synced`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sync failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
