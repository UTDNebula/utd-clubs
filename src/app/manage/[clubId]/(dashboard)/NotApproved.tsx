import Typography from '@mui/material/Typography';

const NotAccepted = ({ status }: { status: 'pending' | 'rejected' }) => {
  return (
    <div className="w-full flex flex-col gap-2 rounded-lg bg-cornflower-50 sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4 min-w-0">
      <Typography variant="h2" className="ml-2 text-xl font-bold text-gray-800">
        {status === 'pending' && 'Your organization is pending review.'}
        {status === 'rejected' && 'Your organization has been rejected.'}
      </Typography>
      <div className="px-2">
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
    </div>
  );
};

export default NotAccepted;
