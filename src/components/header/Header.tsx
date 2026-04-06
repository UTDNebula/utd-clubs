'use server';

import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ClubMatchButton from '@src/components/header/ClubMatchButton';
import Sidebar from '@src/components/nav/Sidebar';
import { ClubSearchBar } from '@src/components/searchBar/ClubSearchBar';
import { EventSearchBar } from '@src/components/searchBar/EventSearchBar';
import { BaseHeader, BaseHeaderProps } from './BaseHeader';

const DefaultHeaderItems = () => (
  <>
    <Tooltip title="Support Nebula Labs on Comet Giving Days">
      <Link
        href="https://givingday.utdallas.edu/giving-day/115742/department/118896"
        target="_blank"
      >
        <Image
          unoptimized
          width={128}
          height={128}
          src="/comet-giving-days.png"
          alt="UTD Giving Days Comet Logo"
          className="h-10 w-10 max-w-none"
        />
      </Link>
    </Tooltip>
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
      searchBar={<ClubSearchBar />}
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
