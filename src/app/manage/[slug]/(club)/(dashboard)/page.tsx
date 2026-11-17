import PreviewIcon from '@mui/icons-material/Preview';
import Tooltip from '@mui/material/Tooltip';
import { notFound } from 'next/navigation';
import Panel from '@nebula-library/components/Panel';
import { LinkButton } from '@/lib/components/LinkButton';
import ClubManageForm from '@/systems/manage/ClubManageForm';
import ManageHeader from '@/systems/manage/ManageHeader';
import { api } from '@/trpc/server';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const club = await api.club.bySlug({ slug });

  if (!club) {
    notFound();
  }
  return (
    <>
      <ManageHeader club={club} hrefBack={`/directory/${slug}`}></ManageHeader>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          <div className="flex w-full max-w-6xl flex-col gap-8">
            <Panel heading="Customize your club">
              <div className="flex flex-col gap-2 px-2">
                <div className="prose prose-slate dark:prose-invert prose-a:text-royal dark:prose-a:text-cornflower-300 prose-sm md:prose-base">
                  Make sure to keep this page up to date with the latest
                  information about your club. Click the button below to see
                  your club&apos;s listing page.
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {club.approved === 'approved' && (
                    <LinkButton
                      href={`/directory/${slug}`}
                      variant="contained"
                      className="whitespace-pre normal-case"
                      startIcon={<PreviewIcon />}
                      size="large"
                    >
                      Preview in new tab
                      <Tooltip title="Refreshes Daily">
                        <span className="ml-1 text-xs text-slate-300 dark:text-slate-700"></span>
                      </Tooltip>
                    </LinkButton>
                  )}
                </div>
              </div>
            </Panel>
          </div>
          <ClubManageForm club={club} />
        </div>
      </div>
    </>
  );
};
export default Page;
