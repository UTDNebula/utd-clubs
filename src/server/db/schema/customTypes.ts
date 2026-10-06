import { customType } from 'drizzle-orm/pg-core';

// tsvector (for lakebase_bm25)
export const tsvector = (name: string) =>
  customType<{ data: string }>({
    dataType() {
      return 'tsvector';
    },
  })(name);
