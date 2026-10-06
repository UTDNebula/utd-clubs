'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClubSearchBar } from '@/systems/clubs/ClubSearchBar';

export const ClubSearchContainer = () => {
  const [input, setInput] = useState('');
  const router = useRouter();

  return (
    <ClubSearchBar
      input={input}
      onChange={setInput}
      onSelect={(value) => {
        if (typeof value === 'string') {
          router.push(`/?search=${encodeURIComponent(value)}`);
        } else {
          router.push(`/directory/${value.slug}`);
        }
      }}
    />
  );
};
