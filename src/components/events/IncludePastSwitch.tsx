'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function IncludePastSwitch({ checked }: { checked: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <FormControlLabel
      label="Include past events"
      control={
        <Switch
          checked={checked}
          onChange={(_, nextChecked) => {
            const next = new URLSearchParams(searchParams.toString());

            next.set('includePast', nextChecked ? 'true' : 'false');
            next.set('page', '1');
            router.replace(`${pathname}?${next.toString()}`);
          }}
        />
      }
    />
  );
}
