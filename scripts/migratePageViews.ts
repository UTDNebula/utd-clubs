/*
Get page views for directory pages from Google Analytics and push them to Neon.
To allow sorting on homepage by popularity.
Requires GOOGLE_ANALYTICS_PROPERTY_ID, GOOGLE_ANALYTICS_SERVICE_ACCOUNT, and DATABASE_URL environment variables.
*/
import { resolve } from 'path';
import { BetaAnalyticsDataClient, protos } from '@google-analytics/data';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { club } from '../src/server/db/schema/club';

const envPath = resolve(__dirname, '../.env');
config({ path: envPath });

if (
  typeof process.env.GOOGLE_ANALYTICS_PROPERTY_ID === 'undefined' ||
  typeof process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT === 'undefined' ||
  typeof process.env.DATABASE_URL === 'undefined'
) {
  throw new Error('Required environment variables are not set.');
}

const GOOGLE_ANALYTICS_SERVICE_ACCOUNT =
  process.env.GEMINI_SERVICE_ACCOUNT !== ''
    ? (JSON.parse(process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT as string) as {
        client_email: string;
        private_key: string;
      })
    : { client_email: '', private_key: '' };
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: GOOGLE_ANALYTICS_SERVICE_ACCOUNT.client_email,
    private_key: GOOGLE_ANALYTICS_SERVICE_ACCOUNT.private_key,
  },
});

async function getPageViews() {
  console.log('Fetching page views from Google Analytics...');
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dateRanges: [{ startDate: '2015-08-14', endDate: 'yesterday' }],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { matchType: 'BEGINS_WITH', value: '/directory/' },
      },
    },
    metricAggregations: [
      protos.google.analytics.data.v1beta.MetricAggregation.TOTAL,
    ],
  });

  if (response.rows == null) {
    throw new Error('Response rows undefined.');
  }

  return Object.fromEntries(
    response.rows.map((row) => {
      if (
        row.dimensionValues == null ||
        row.dimensionValues[0] == null ||
        row.metricValues == null ||
        row.metricValues[0] == null ||
        row.metricValues[0].value == null
      ) {
        throw new Error('Row in response undefined.');
      }
      if (!row.dimensionValues[0].value?.startsWith('/directory/')) {
        throw new Error('Response does not match filter.');
      }
      return [
        row.dimensionValues[0].value.replace('/directory/', ''),
        parseInt(row.metricValues[0].value),
      ];
    }),
  );
}

async function pushToDatabase(pageViews: { [key: string]: number }) {
  console.log('Updating page views in database...');

  const schema = {
    ...club,
  };
  if (typeof process.env.DATABASE_URL === 'undefined') {
    throw new Error('DATABASE_URL is undefined.');
  }
  const db = drizzle(process.env.DATABASE_URL, {
    schema,
  });

  const updatePromises = Object.entries(pageViews).map(([slug, count]) => {
    return db.update(club).set({ pageViews: count }).where(eq(club.slug, slug));
  });

  try {
    await Promise.all(updatePromises);
    console.log(
      `Successfully updated page views for ${updatePromises.length} clubs.`,
    );
  } catch (error) {
    console.error('Error updating page views:', error);
    throw error;
  }
}

async function migratePageViews() {
  try {
    const pageViews = await getPageViews();
    await pushToDatabase(pageViews);
    console.log('Page view migration completed successfully.');
  } catch (error) {
    console.error('Page view migration failed:', error);
    process.exit(1);
  }
}

migratePageViews();
