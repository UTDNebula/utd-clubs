import AdminHeader from '@src/components/admin/AdminHeader';
import { api } from '@src/trpc/server';
import TagList from './TagList';

export default async function Page() {
  const [tags, topTags] = await Promise.all([
    api.club.distinctTags(),
    api.club.topTags(),
  ]);

  return (
    <>
      <AdminHeader path={[{ text: 'Admin', href: '/admin' }, 'Tags']} />
      <main className="mb-5 flex flex-col gap-y-8 max-w-2xl mx-auto">
        <TagList tags={tags} topTags={topTags} />
      </main>
    </>
  );
}
