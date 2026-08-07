import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PreviewIcon from '@mui/icons-material/Preview';
import Tooltip from '@mui/material/Tooltip';
import { notFound } from 'next/navigation';
import { LinkButton } from '@/common/components/LinkButton';
import ManageHeader from '@/systems/manage/ManageHeader';
import { api } from '@/trpc/server';
import ClubManageForm from '@/systems/manage/ClubManageForm';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const club = await api.club.bySlug({ slug });

  if (!club) {
    notFound();
  }
  return (
    <>
      <ManageHeader club={club} hrefBack="/manage">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-2 max-sm:gap-x-4">
          <LinkButton
            href={`/manage/${slug}/followers`}
            variant="contained"
            className="whitespace-nowrap normal-case"
            startIcon={<PeopleIcon />}
            size="large"
          >
            Followers
          </LinkButton>
          <LinkButton
            href={`/manage/${slug}/events`}
            variant="contained"
            className="whitespace-nowrap normal-case"
            startIcon={<EventIcon />}
            size="large"
          >
            Events
          </LinkButton>
          {club.approved === 'approved' && (
            <LinkButton
              href={`/directory/${slug}`}
              variant="contained"
              className="whitespace-pre normal-case"
              startIcon={<PreviewIcon />}
              size="large"
            >
              Listing
              <Tooltip title="Refreshes Daily">
                <span className="ml-1 text-xs text-slate-300 dark:text-slate-700">
                  ({club.pageViews?.toLocaleString() ?? 0} views in past week)
                </span>
              </Tooltip>
            </LinkButton>
          )}
        </div>
      </ManageHeader>
      <div className="flex w-full flex-col items-center">
        <ClubManageForm club={club} />
      </div>
    </>
  );
};
export default Page;
