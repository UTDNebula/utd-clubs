import { type ReactNode } from 'react';
import { BaseHeader } from '@src/components/header/BaseHeader';

const Layout = ({
  // params,
  children,
  // events,
}: {
  // params: { clubId: string };
  children: ReactNode;
  // events: ReactNode;
}) => {
  // const session = await getServerAuthSession();
  // if (!session) redirect(signInRoute(`manage/${params.clubId}`));
  // const canAccess = await api.club.isOfficer({ id: params.clubId });
  // if (!canAccess) {
  //   return <div className="">You can&apos;t access this 😢</div>;
  // }
  // const club = await api.club.byId({ id: params.clubId });
  // if (!club) {
  //   notFound();
  // }
  return (
    <div className="">
      {/* <ClubSearchBar />
        create new club */}
      {/* <BaseHeader>{null}</BaseHeader> */}
      <BaseHeader>{/* <span>Club Management</span> */}</BaseHeader>

      <div className="flex w-full items-center justify-center">
        <main className="w-full max-w-6xl">
          <div className="px-5">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
