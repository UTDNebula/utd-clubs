'use client';

import { useState } from 'react';
import ClubTagAutocomplete from '@/systems/clubs/ClubTagAutocomplete';

export default function Page() {
  const [value, setValue] = useState<string[]>([]);

  console.log('value', value);

  return (
    <ClubTagAutocomplete
      allowAddingOptions
      value={value}
      onChange={(v) => setValue(v)}
    />
  );
}