import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Panel from '@src/components/form/Panel';

const NotAccepted = ({ status }: { status: 'pending' | 'rejected' }) => {
  return (
    <Panel
      className="bg-cornflower-50"
      startAdornment={<AccessTimeIcon />}
      heading={
        <>
          {status === 'pending' && 'Your organization is pending review.'}
          {status === 'rejected' && 'Your organization has been rejected.'}
        </>
      }
    >
      <div className="flex flex-col gap-2 px-2">
        <p>It is not publically visible at this time. </p>
        {status === 'pending' && (
          <p>
            While we work on approving it, please take the time to fill out more
            information below.
          </p>
        )}
        <p>
          If you have any questions, please reach out on our{' '}
          <a
            href="https://discord.utdnebula.com/"
            className="text-royal underline decoration-transparent hover:decoration-inherit transition"
          >
            Discord
          </a>{' '}
          or{' '}
          <a
            href="https://www.instagram.com/utdnebula/"
            className="text-royal underline decoration-transparent hover:decoration-inherit transition"
          >
            {' '}
            Instagram
          </a>
          .
        </p>
      </div>
    </Panel>
  );
};

export default NotAccepted;
