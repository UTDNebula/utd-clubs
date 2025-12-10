import AdminHeader from '@src/components/admin/AdminHeader';
import TagSwapper from './TagSwapper';

export default function Page() {
  return (
    <>
      <AdminHeader path={[{ text: 'Admin', href: '/admin' }, 'Tags']} />
      <div className="flex w-full flex-col items-center">
        <TagSwapper />
      </div>
    </>
  );
}
