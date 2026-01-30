'use client';

import Pagination from '@mui/material/Pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function EventsPagination({
  page,
  totalPages,
  pageSize,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  return (
    <Pagination
      page={page}
      count={totalPages}
      onChange={(_, newPage) => {
        const next = new URLSearchParams(searchParams.toString());
        next.set('page', String(newPage));
        next.set('pageSize', String(pageSize));
        router.replace(`${pathname}?${next.toString()}`);
      }}
    />
  );
}
