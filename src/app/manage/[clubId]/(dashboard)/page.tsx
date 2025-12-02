import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import Link from 'next/link';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const params = await props.params;
  return (
    <>
      <div className="flex flex-row flex-wrap gap-x-10 gap-y-4 rounded-lg bg-white p-2 shadow-xs">
        <Link href={`/manage/${params.clubId}/edit`}>
          <Button
            variant="contained"
            className="normal-case"
            startIcon={<EditIcon />}
            size="large"
          >
            Edit Club Data
          </Button>
        </Link>
        <Link href={`/manage/${params.clubId}/edit/officers`}>
          <Button
            variant="contained"
            className="normal-case"
            startIcon={<PersonIcon />}
            size="large"
          >
            Manage Officers
          </Button>
        </Link>
        <Button
          variant="contained"
          className="normal-case"
          startIcon={<PeopleIcon />}
          size="large"
          disabled
        >
          View Members
        </Button>
        <Link href={`/manage/${params.clubId}/create`}>
          <Button
            variant="contained"
            className="normal-case"
            startIcon={<AddIcon />}
            size="large"
          >
            Create Event
          </Button>
        </Link>
      </div>
    </>
  );
};
export default Page;
