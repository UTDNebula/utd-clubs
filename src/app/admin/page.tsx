import { Button } from '@mui/material';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="m-5">
      <h1 className="font-display text-center text-4xl font-bold text-haiti">
        Admin
      </h1>
      <div className="flex justify-center gap-x-5 pt-20">
        <Link href="/admin/clubs">
          <Button variant="contained" className="normal-case" size="large">
            Manage Clubs
          </Button>
        </Link>
        <Button
          variant="contained"
          className="normal-case"
          size="large"
          disabled
        >
          Manage Users
        </Button>
        <Link href="/admin/tags">
          <Button variant="contained" className="normal-case" size="large">
            Change Tags
          </Button>
        </Link>
      </div>
    </div>
  );
}
