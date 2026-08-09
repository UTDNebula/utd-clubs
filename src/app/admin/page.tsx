import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import { Button, Tooltip } from '@mui/material';
import AdminHeader from '@/systems/admin/AdminHeader';
import { LinkButton } from '@/lib/components/LinkButton';

export default function Page() {
  return (
    <AdminHeader path={['Admin']}>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-2 max-sm:gap-x-4">
        <LinkButton
          href="/admin/clubs"
          variant="contained"
          className="whitespace-nowrap normal-case"
          startIcon={<GroupsIcon />}
          size="large"
        >
          Clubs
        </LinkButton>
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
        <LinkButton
          href="/admin/tags"
          variant="contained"
          className="normal-case"
          startIcon={<TagIcon />}
          size="large"
        >
          Tags
        </LinkButton>
      </div>
    </AdminHeader>
  );
}
