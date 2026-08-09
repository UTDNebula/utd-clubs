import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LinkButton } from '@/lib/components/LinkButton';

interface Props {
  type: 'clubs' | 'events';
}

export default function NotFollowingOrRegistered(props: Props) {
  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <p className="font-bold text-slate-500 dark:text-slate-400">
        {props.type === 'clubs'
          ? "You aren't following any clubs."
          : "You haven't registered for any events."}
      </p>
      <LinkButton
        href={props.type === 'clubs' ? '/' : '/events'}
        variant="contained"
        className="normal-case"
        size="large"
        endIcon={<ArrowForwardIcon />}
      >
        {props.type === 'clubs' ? 'Check Out Clubs' : 'Check Out Events'}
      </LinkButton>
    </div>
  );
}
