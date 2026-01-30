import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import { Button, Tooltip } from '@mui/material';
import Link from 'next/link';
import AdminHeader from '@src/components/admin/AdminHeader';

export default function Page() {
  return (
    <AdminHeader path={['Admin']}>
      <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
        <Button
          LinkComponent={Link}
          href="/admin/clubs"
          variant="contained"
          className="normal-case whitespace-nowrap"
          startIcon={<GroupsIcon />}
          size="large"
        >
          Clubs
        </Button>
        <Tooltip title="Coming soon">
          <span>
            <Button
              variant="contained"
              className="normal-case"
              startIcon={<PersonIcon />}
              size="large"
              disabled
            >
              Users
            </Button>
          </span>
        </Tooltip>
        <Button
          LinkComponent={Link}
          href="/admin/tags"
          variant="contained"
          className="normal-case"
          startIcon={<TagIcon />}
          size="large"
        >
          Tags
        </Button>
      </div>
    </AdminHeader>
  );
}
