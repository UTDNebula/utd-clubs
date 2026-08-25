'use server';

import { BaseHeader, BaseHeaderProps } from '@/lib/components/BaseHeader';
import UTDClubsLogoStandalone from '@/lib/icons/UTDClubsLogo';
import { ClubSearchBar } from '@/systems/clubs/ClubSearchBar';
import { EventSearchBar } from '@/systems/events/EventSearchBar';
import Sidebar from '../drawer/Sidebar';
import ClubMatchButton from './ClubMatchButton';
import { ProfileDropDown } from './ProfileDropDown';

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
  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      logoIcon={<UTDClubsLogoStandalone />}
      logoText={{ projectName: 'UTD CLUBS', byline: 'by Nebula Labs' }}
      searchBar={<ClubSearchBar />}
      account={<ProfileDropDown />}
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
