'use server';

import ClubMatchButton from '@src/components/header/ClubMatchButton';
import Sidebar from '../nav/Sidebar';
import { ClubSearchBar } from '../searchBar/ClubSearchBar';
import { EventSearchBar } from '../searchBar/EventSearchBar';
import { BaseHeader, BaseHeaderPropsBase } from './BaseHeader';

const defaultHeaderItems = (
  <>
    <div className="sm:hidden">
      <ClubMatchButton shadow={false} iconOnly />
    </div>
    <div className="max-sm:hidden">
      <ClubMatchButton />
    </div>
  </>
);

const Header = async (props: BaseHeaderPropsBase) => {
  return (
    <BaseHeader
      menu={<Sidebar hamburgerColor={props.color} />}
      searchBar={<ClubSearchBar />}
      {...props}
    >
      {defaultHeaderItems}
    </BaseHeader>
  );
};

export const EventHeader = async (props: BaseHeaderPropsBase) => {
  return (
    <BaseHeader
      menu={<Sidebar hamburgerColor={props.color} />}
      searchBar={<EventSearchBar />}
      {...props}
    >
      {defaultHeaderItems}
    </BaseHeader>
  );
};

export default Header;
