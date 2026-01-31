import { addHours } from 'date-fns';
import { lte } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@src/server/db';
import { calendarWebhooks } from '@src/server/db/schema/calendarWebhooks';
import { stopWatching, watchCalendar } from '@src/utils/calendar';

export const dynamic = 'force-dynamic'; // do not cache response

export async function GET(req: Request) {
  // verify the request is actually from Vercel
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // find webhooks expiring in the next 24hrs
  const expiringWebhooks = await db.query.calendarWebhooks.findMany({
    where: lte(calendarWebhooks.expiration, addHours(new Date(), 24)),
  });

  console.log(`Found ${expiringWebhooks.length} expiring webhooks`);

  if (expiringWebhooks.length === 0) {
    return NextResponse.json({ renewed: 0, status: 'No expiries found' });
  }

  // renew
  const results = await Promise.allSettled(
    expiringWebhooks.map(async (webhook) => {
      try {
        // need to keep an active webhook at all times so it doesn't miss an update
        const res = await watchCalendar(webhook.clubId, true); // add a new webhook even though one exists
        await stopWatching(webhook.clubId, res.channelId); // delete all old webhooks for the club except the newly created one

        console.log(
          `successfully renewed webhook for clubid ${webhook.clubId}`,
        );
        return { clubId: webhook.clubId, status: 'renewed' };
      } catch (error) {
        console.error(`Failed to renew club ${webhook.clubId}`, error);
        // TODO: what to do here?
        throw error;
      }
    }),
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return NextResponse.json({
    success: true,
    renewed: successful,
    failed: failed,
  });
}
