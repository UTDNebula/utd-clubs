import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LinkButton } from '@src/components/LinkButton';

export default function NotRegistered() {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <p className="font-bold text-slate-500 dark:text-slate-400">
        You haven&apos;t registered for any events.
      </p>
      <LinkButton
        href="/events"
        variant="contained"
        className="normal-case"
        size="large"
        endIcon={<ArrowForwardIcon />}
      >
        Check Out Events
      </LinkButton>
    </div>
  );
}
