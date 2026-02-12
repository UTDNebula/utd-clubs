/*
Get page views for directory pages from Google Analytics and push them to Neon.
To allow sorting on homepage by popularity.
Requires GOOGLE_ANALYTICS_PROPERTY_ID, GOOGLE_ANALYTICS_SERVICE_ACCOUNT, and DATABASE_URL environment variables.
Google Analytics API Documentation: https://ga-dev-tools.google/ga4/query-explorer/
*/
import { BetaAnalyticsDataClient, protos } from '@google-analytics/data';
import { eq, getTableName, notInArray } from 'drizzle-orm';
import { type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { db } from '../src/server/db';
import { club } from '../src/server/db/schema/club';
import { events } from '../src/server/db/schema/events';

if (
  typeof process.env.GOOGLE_ANALYTICS_PROPERTY_ID === 'undefined' ||
  typeof process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT === 'undefined'
) {
  throw new Error('Required environment variables are not set.');
}

const serviceAccount = JSON.parse(process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT);
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});

async function getPathPageViews(path: string) {
  console.log('Fetching page views from Google Analytics...');
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoString = oneWeekAgo.toISOString().split('T')[0];
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dateRanges: [{ startDate: oneWeekAgoString, endDate: 'yesterday' }],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { matchType: 'BEGINS_WITH', value: `/${path}/` },
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
      if (!row.dimensionValues[0].value?.startsWith(`/${path}/`)) {
        throw new Error('Response does not match filter.');
      }
      return [
        row.dimensionValues[0].value.replace(`/${path}/`, ''),
        parseInt(row.metricValues[0].value),
      ];
    }),
  );
}

async function pushToDatabaseTable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: PgTableWithColumns<any>,
  matchOn: 'slug' | 'id',
  pageViews: { [key: string]: number },
) {
  console.log(`Updating page views in ${getTableName(table)} table...`);

  const updatePromises = Object.entries(pageViews).map(([slug, count]) => {
    return db
      .update(table)
      .set({ pageViews: count })
      .where(eq(table[matchOn], slug));
  });

  updatePromises.push(
    db
      .update(table)
      .set({ pageViews: 0 })
      .where(notInArray(table[matchOn], Object.keys(pageViews))),
  );

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
    const clubPageViews = await getPathPageViews('directory');
    await pushToDatabaseTable(club, 'slug', clubPageViews);

    const eventPageViews = await getPathPageViews('events');
    await pushToDatabaseTable(events, 'id', eventPageViews);

    console.log('Page view migration completed successfully.');
  } catch (error) {
    console.error('Page view migration failed:', error);
    process.exit(1);
  }
}

migratePageViews();
