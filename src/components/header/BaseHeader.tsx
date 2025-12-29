import Image from 'next/image';
import Link from 'next/link';
import gradientBG from 'public/images/landingGradient.png';
import type { ReactNode } from 'react';
import ClubMatchButton from '@src/components/header/ClubMatchButton';
import NebulaLogo from '@src/icons/NebulaLogo';
import { api } from '@src/trpc/server';
import NewSidebar from '../nav/Slide';
import { ClubSearchBar } from '../searchBar/ClubSearchBar';
import { EventSearchBar } from '../searchBar/EventSearchBar';
import { ProfileDropDown } from './ProfileDropDown';

export const BaseHeader = async ({ children }: { children?: ReactNode }) => {
  const userCapabilities = await api.userMetadata.getUserSidebarCapabilities();
  return (
    <div className="sticky top-0 z-50 flex w-full justify-between items-center gap-y-0 gap-x-2 md:gap-x-4 lg:gap-x-8 py-2 px-2 sm:px-4 flex-wrap sm:flex-nowrap">
      <Image
        src={gradientBG}
        alt="gradient background"
        fill
        className="object-cover -z-20"
        sizes="120vw"
      />
      <div className="absolute inset-0 bg-lighten dark:bg-darken -z-10"></div>
      <div className="grow basis-0 flex gap-x-2 md:gap-x-4 lg:gap-x-8">
        <NewSidebar userCapabilities={userCapabilities} />
        <Link
          href="/"
          className="lext-lg md:text-xl font-display font-medium md:font-bold flex gap-2 items-center"
        >
          <NebulaLogo className="h-6 w-auto fill-haiti dark:fill-white" />
          <span className="whitespace-nowrap">UTD CLUBS</span>
        </Link>
      </div>
      <div className="grow order-last basis-full sm:order-none sm:basis-auto gap-x-2 md:gap-x-4 lg:gap-x-8">
        {children}
      </div>
      <div className="grow basis-0 flex justify-end items-center gap-x-2">
        <div className="sm:hidden">
          <ClubMatchButton shadow iconOnly />
        </div>
        <div className="max-sm:hidden">
          <ClubMatchButton shadow />
        </div>
        <ProfileDropDown />
      </div>
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
    <BaseHeader>
      <EventSearchBar />
    </BaseHeader>
  );
};

export default Header;
