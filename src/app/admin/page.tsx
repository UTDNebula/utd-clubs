import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import { Button, Tooltip } from '@mui/material';
import AdminHeader from '@src/components/admin/AdminHeader';
import { LinkButton } from '@src/components/LinkButton';

export default async function Page() {
  return (
    <AdminHeader path={['Admin']}>
      <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
        <LinkButton
          href="/admin/clubs"
          variant="contained"
          className="normal-case whitespace-nowrap"
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
        <LinkButton
          href="/admin/email"
          variant="contained"
          className="normal-case"
          startIcon={<EmailIcon />}
          size="large"
        >
          Email
        </LinkButton>
      </div>
    </AdminHeader>
  );
}
