vi.mock('server-only', () => ({}));
vi.mock('client-only', () => ({}));

vi.mock(import('next/headers'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    headers: vi.fn(() => Promise.resolve(new Headers())),
  };
});
