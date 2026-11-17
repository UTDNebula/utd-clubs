import { notFound } from 'next/navigation';
import Slug from '@/systems/manage/forms/Slug';
import ManageHeader from '@/systems/manage/ManageHeader';
import Resources from '@/systems/manage/Resources';
import { api } from '@/trpc/server';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const club = await api.club.bySlug({ slug });

  if (!club) {
    notFound();
  }

  const awaitedRole = await api.user.clubs.memberType({ clubId: club.id }); // role to pass to slug
  const role = awaitedRole as 'President' | 'Officer';

  return (
    <>
      <ManageHeader club={club} hrefBack={`/manage/${slug}`}></ManageHeader>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          <Resources />
          <Slug club={club} role={role} />
        </div>
      </div>
    </>
  );
};
export default Page;
