import AdminHeader from '@src/systems/admin/AdminHeader';
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
      <main className="mx-auto mb-5 flex max-w-2xl flex-col gap-y-8">
        <TagList tags={tags} topTags={topTags} />
      </main>
    </>
  );
}
