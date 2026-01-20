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

/**
 * Determines when a color should be styled light or dark
 * - `"light"` Component is always styled light-colored
 * - `"dark"` Component is always styled dark-color
 * - `"lightDark"` Component is styled light-colored in light mode and dark-colored in dark mode
 * - `"darkLight"` Component is styled dark-colored in light mode and light-colored in dark mode
 */
export type ContentComponentColor =
  | 'light'
  | 'dark'
  | 'lightDark'
  | 'darkLight';

export type HeaderItemVisibility = {
  menu?: boolean;
  logo?: boolean;
  children?: boolean;
  clubMatch?: boolean;
  account?: boolean;
};

type BaseHeaderProps = {
  children?: ReactNode;
  className?: string;
  /**
   * Manages the visibility of items in the header
   */
  itemVisibility?: HeaderItemVisibility;
  /**
   * Hides the background gradient on the header
   */
  transparent?: boolean;
  /**
   * Stops the header from sticking to the top of the page
   */
  disableSticky?: boolean;
  /**
   * Determines the color of UI elements
   * - `"light"` UI elements are white
   * - `"dark"` UI elements are black
   * - `"lightDark"` UI elements are white in light mode and black in dark mode
   * - `"darkLight"` UI elements are black in light mode and white in dark mode
   * @default "darkLight"
   */
  color?: 'light' | 'dark' | 'lightDark' | 'darkLight';
};

export const BaseHeader = async ({
  children,
  className,
  itemVisibility: {
    menu: menuVisibility = true,
    logo: logoVisibility = true,
    children: childrenVisibility = true,
    clubMatch: clubMatchVisibility = true,
    account: accountVisibility = true,
  } = {},
  transparent = false,
  disableSticky = false,
  color = 'darkLight',
}: BaseHeaderProps) => {
  const userCapabilities = await api.userMetadata.getUserSidebarCapabilities();
  return (
    <div
      className={`${disableSticky ? '' : 'sticky'} top-0 z-50 flex w-full justify-between items-center gap-y-0 gap-x-2 md:gap-x-4 lg:gap-x-8 py-2 px-2 sm:px-4 flex-wrap sm:flex-nowrap ${transparent ? '' : 'bg-lighten dark:bg-darken'} ${className}`}
    >
      {!transparent && (
        <>
          <Image
            src={gradientBG}
            alt="gradient background"
            fill
            className="object-cover -z-20"
            sizes="120vw"
          />
          <div className="absolute inset-0 bg-lighten dark:bg-darken -z-10"></div>
        </>
      )}
      <div className="grow basis-0 flex gap-x-2 md:gap-x-4 lg:gap-x-8">
        {menuVisibility && (
          <NewSidebar
            userCapabilities={userCapabilities}
            hamburgerColor={color}
          />
        )}
        {logoVisibility && (
          <Link
            href="/"
            className={`lext-lg md:text-xl font-display font-medium md:font-bold flex gap-2 items-center ${
              color?.startsWith('light') ? 'text-white' : 'text-haiti'
            } ${
              color === 'lightDark'
                ? 'dark:text-haiti'
                : color === 'darkLight'
                  ? 'dark:text-white'
                  : ''
            }`}
          >
            <NebulaLogo
              className={`h-6 w-auto ${
                color?.startsWith('light') ? 'fill-white' : 'fill-haiti'
              } ${
                color === 'lightDark'
                  ? 'dark:fill-haiti'
                  : color === 'darkLight'
                    ? 'dark:fill-white'
                    : ''
              }`}
            />
            <span className="whitespace-nowrap">UTD CLUBS</span>
          </Link>
        )}
      </div>
      {childrenVisibility && (
        <div className="grow order-last basis-full sm:order-none sm:basis-auto gap-x-2 md:gap-x-4 lg:gap-x-8">
          {children}
        </div>
      )}
      <div className="grow basis-0 flex justify-end items-center gap-x-2">
        {clubMatchVisibility && (
          <>
            <div className="sm:hidden">
              <ClubMatchButton shadow={false} iconOnly />
            </div>
            <div className="max-sm:hidden">
              <ClubMatchButton />
            </div>
          </>
        )}

        {accountVisibility && <ProfileDropDown />}
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
