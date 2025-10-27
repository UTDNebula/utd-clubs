import { BaseHeader } from '@src/components/header/BaseHeader';
// import { BlueBackButton } from '@src/components/backButton';
// import { getServerAuthSession } from '@src/server/auth';
// import { api } from '@src/trpc/server';
// import { signInRoute } from '@src/utils/redirect';
// import { notFound, redirect } from 'next/navigation';
import { type ReactNode } from 'react';
// import ClubManageHeader from '@src/components/header/ClubManageHeader';
// import PillButton from '@src/components/PillButton';

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
          {/* <div className="flex w-full flex-row gap-x-4 align-middle">
          <BlueBackButton />
          <h1 className="from-blue-primary bg-linear-to-br to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent">
          {club.name}
          </h1>
          </div> */}

          {/* <ClubManage params={{ clubId: club.id }}>test</ClubManage> */}
          {/* <ClubManageHeader club={club}>
          <PillButton></PillButton>
          <PillButton></PillButton>
          </ClubManageHeader> */}

          {/* {children} */}
          {/* <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-row gap-4">{events}</div>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
