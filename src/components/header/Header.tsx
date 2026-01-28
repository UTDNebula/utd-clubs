'use server';

import ClubMatchButton from '@src/components/header/ClubMatchButton';
import Sidebar from '../nav/Sidebar';
import { ClubSearchBar } from '../searchBar/ClubSearchBar';
import { EventSearchBar } from '../searchBar/EventSearchBar';
import { BaseHeader, BaseHeaderPropsBase } from './BaseHeader';

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

const Header = async (props: BaseHeaderPropsBase) => {
  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      searchBar={<ClubSearchBar />}
      {...props}
    >
      <DefaultHeaderItems />
    </BaseHeader>
  );
};

export const EventHeader = async (props: BaseHeaderPropsBase) => {
  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      searchBar={<EventSearchBar />}
      {...props}
    >
      <DefaultHeaderItems />
    </BaseHeader>
  );
};

export default Header;
