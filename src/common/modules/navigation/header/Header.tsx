'use server';

import ClubMatchButton from '@src/common/modules/navigation/header/ClubMatchButton';
import Sidebar from '@src/common/modules/navigation/drawer/Sidebar';
import { ClubSearchBar } from '@src/systems/clubs/ClubSearchBar';
import { EventSearchBar } from '@src/systems/events/EventSearchBar';
import UTDClubsLogoStandalone from '@src/common/icons/UTDClubsLogo';
import { BaseHeader, BaseHeaderProps } from './BaseHeader';
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
