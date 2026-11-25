declare global {
  const withDb: (typeof import('./db'))['withDb'];
  const wrapWithDb: (typeof import('./db'))['wrapWithDb'];
  const wrapWithSharedDb: (typeof import('./db'))['wrapWithSharedDb'];
  const testWithDb: (typeof import('./db'))['testWithDb'];
  const itWithDb: (typeof import('./db'))['itWithDb'];
  const describeWithDb: (typeof import('./db'))['describeWithDb'];
  const describeWithSharedDb: (typeof import('./db'))['describeWithSharedDb'];
  const suiteWithDb: (typeof import('./db'))['suiteWithDb'];
  const suiteWithSharedDb: (typeof import('./db'))['suiteWithSharedDb'];
}

export {};
