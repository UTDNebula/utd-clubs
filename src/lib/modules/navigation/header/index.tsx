import { headers } from 'next/headers';
import { Suspense } from 'react';
import { BaseHeader, BaseHeaderProps } from '@/lib/components/BaseHeader';
import UTDClubsLogoStandalone from '@/lib/icons/UTDClubsLogo';
import { auth } from '@/server/auth';
import { EventSearchBar } from '@/systems/events/EventSearchBar';
import Sidebar from '../drawer/Sidebar';
import ClubMatchButton from './ClubMatchButton';
import { ClubSearchContainer } from './ClubSearchContainer';
import ProfileDropDown, { ProfileDropDownFallback } from './ProfileDropDown';

const DefaultHeaderItems = () => (
  <>
    <div className="sm:hidden">
      <ClubMatchButton iconOnly />
    </div>
    <div className="max-sm:hidden">
      <ClubMatchButton />
    </div>
  </>
);

const Header = async (props: BaseHeaderProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      logoIcon={<UTDClubsLogoStandalone />}
      logoText={{ projectName: 'UTD CLUBS', byline: 'by Nebula Labs' }}
      searchBar={<ClubSearchContainer />}
      account={
        <Suspense fallback={<ProfileDropDownFallback />}>
          <ProfileDropDown initialSession={session} />
        </Suspense>
      }
      {...props}
    >
      {props.children}
      <DefaultHeaderItems />
    </BaseHeader>
  );
};

export const EventHeader = async (props: BaseHeaderProps) => {
  return <Header searchBar={<EventSearchBar />} {...props} />;
};

export default Header;
