import type { ReactNode } from 'react';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import NewSidebar from '../nav/Slide';
import { ClubSearchBar } from '../searchBar/ClubSearchBar';
import { EventSearchBar } from '../searchBar/EventSearchBar';
import { ProfileDropDown } from './ProfileDropDown';

export const BaseHeader = async ({ children }: { children?: ReactNode }) => {
  const session = await getServerAuthSession();
  const userCapabilities = await api.userMetadata.getUserSidebarCapabilities();
  return (
    <div className="sticky top-0 z-50 flex w-full shrink justify-between items-center bg-[#edeff2] px-5 py-2.5">
      <NewSidebar userCapabilities={userCapabilities} hamburger="black" />
      {children}
      <ProfileDropDown session={session} />
    </div>
  );
};

const Header = () => {
  return (
    <BaseHeader>
      <ClubSearchBar />
    </BaseHeader>
  );
};

export const EventHeader = () => {
  return (
    <>
      <BaseHeader>
        <EventSearchBar />
      </BaseHeader>
    </>
  );
};

export default Header;
