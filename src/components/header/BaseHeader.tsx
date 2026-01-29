'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import gradientBG from 'public/images/landingGradient.png';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { UTDClubsLogoStandalone } from '@src/icons/UTDClubsLogo';
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
  /**
   * Visibility options for the header logo. Valid options:
   * - `true` Automatically switches between "both" or "text" based on screen size
   * - `false` Disabled
   * - `"both"` Always show both the logo icon and text
   * - `"icon"` Only ever show the logo icon
   * - `"text"` Only ever show the logo text
   * @default true
   */
  logo?: true | false | 'both' | 'icon' | 'text';
  /**
   * Visibility options for the header search bar. Valid options:
   * - `true` Automatically switches between "full" or "compact" based on screen size
   * - `false` Disabled
   * - `"full"` Always show full search bar
   * - `"compact"` Always show collapsed search button
   * @default true
   */
  search?: true | false | 'full' | 'compact';
  children?: boolean;
  account?: boolean;
};

export type BaseHeaderProps = {
  children?: ReactNode;
  className?: string;
  /**
   * Component displayed for menu slot
   */
  menu?: ReactNode;
  /**
   * Component displayed for search bar slot. If prop is omitted, search functionality is not displayed
   */
  searchBar?: ReactNode;
  /**
   * Manages the visibility of items in the header
   */
  itemVisibility?: HeaderItemVisibility;
  /**
   * Hides the background gradient on the header
   * @default false
   */
  transparent?: boolean;
  /**
   * Adds text and drop shadows to header items
   * @default false
   */
  shadow?: boolean;
  /**
   * Stops the header from sticking to the top of the page
   * @default false
   */
  disableSticky?: boolean;
  /**
   * Determines the color of UI elements. Valid options:
   * - `"light"` UI elements are white
   * - `"dark"` UI elements are black
   * - `"lightDark"` UI elements are white in light mode and black in dark mode
   * - `"darkLight"` UI elements are black in light mode and white in dark mode
   * @default "darkLight"
   */
  color?: ContentComponentColor;
};

/**
 * Context for child components of BaseHeader
 */
export const BaseHeaderContext = createContext({
  openCompactSearchBar: false,
});

export function useBaseHeaderContext() {
  return useContext(BaseHeaderContext);
}

export const BaseHeader = ({
  children,
  className,
  menu,
  searchBar,
  itemVisibility: {
    menu: menuVisibility = true,
    logo: logoVisibility = true,
    search: searchVisibility = true,
    children: childrenVisibility = true,
    account: accountVisibility = true,
  } = {},
  transparent = false,
  shadow = false,
  disableSticky = false,
  color = 'darkLight',
}: BaseHeaderProps) => {
  const logoIconVisibility =
    logoVisibility === true ||
    logoVisibility === 'both' ||
    logoVisibility === 'icon';
  const logoTextVisibility =
    logoVisibility === true ||
    logoVisibility === 'both' ||
    logoVisibility === 'text';

  // Main search bar
  const fullSearchBarVisibility =
    searchVisibility === true || searchVisibility === 'full';
  // Search bar for small screens
  const compactSearchBarVisibility =
    searchVisibility === true || searchVisibility === 'compact';

  const [openCompactSearchBar, setOpenCompactSearchBar] = useState(false);

  return (
    <BaseHeaderContext.Provider value={{ openCompactSearchBar }}>
      <div
        className={`${disableSticky ? '' : 'sticky'} min-h-17 top-0 z-50 flex w-full justify-between items-center gap-y-2 gap-x-2 md:gap-x-4 lg:gap-x-8 py-2 px-4 ${menu ? 'max-sm:pl-2' : ''} flex-wrap sm:flex-nowrap ${transparent ? '' : 'bg-lighten dark:bg-darken'} ${className}`}
      >
        {!transparent && (
          <>
            <Image
              src={gradientBG}
              alt="gradient background"
              fill
              className="object-cover -z-20 select-none"
              sizes="120vw"
            />
            <div className="absolute inset-0 bg-lighten dark:bg-darken -z-10"></div>
          </>
        )}
        {!openCompactSearchBar ? (
          <>
            <div className="grow basis-0 flex gap-x-2 sm:gap-x-8">
              {menuVisibility && menu}
              {logoVisibility && (
                <Link
                  href="/"
                  className={`font-display flex gap-2 items-center select-none ${
                    color?.startsWith('light') ? 'text-white' : 'text-haiti'
                  } ${
                    color === 'lightDark'
                      ? 'dark:text-haiti'
                      : color === 'darkLight'
                        ? 'dark:text-white'
                        : ''
                  } ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
                >
                  {logoIconVisibility && (
                    <div
                      className={`flex flex-row items-center ${logoVisibility === true ? 'max-sm:hidden' : ''}`}
                    >
                      <UTDClubsLogoStandalone
                        className={`h-10 w-auto ${
                          color?.startsWith('light')
                            ? 'fill-white'
                            : 'fill-haiti'
                        } ${
                          color === 'lightDark'
                            ? 'dark:fill-haiti'
                            : color === 'darkLight'
                              ? 'dark:fill-white'
                              : ''
                        }`}
                      />
                    </div>
                  )}
                  {logoTextVisibility && (
                    <div className="flex flex-col">
                      <span className="whitespace-nowrap text-lg md:text-xl font-bold leading-5">
                        UTD CLUBS
                      </span>
                      <span className="whitespace-nowrap text-xs md:text-sm font-medium">
                        by Nebula Labs
                      </span>
                    </div>
                  )}
                </Link>
              )}
            </div>
            {fullSearchBarVisibility && searchBar && (
              <div
                className={`order-last max-sm:basis-full basis-128 sm:order-none gap-x-2 md:gap-x-4 lg:gap-x-8 ${searchVisibility === true ? 'max-md:hidden' : ''} ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
              >
                {searchBar}
              </div>
            )}
            <div
              className={`grow basis-0 flex justify-end items-center gap-x-2 ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
            >
              {compactSearchBarVisibility && searchBar && (
                <IconButton
                  size="large"
                  className={`${searchVisibility === true ? 'md:hidden' : ''}`}
                  onClick={() => setOpenCompactSearchBar(true)}
                >
                  <SearchIcon />
                </IconButton>
              )}
              {childrenVisibility && children}
              {accountVisibility && <ProfileDropDown />}
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-128 flex gap-x-2 items-center">
              <IconButton
                size="large"
                onClick={() => setOpenCompactSearchBar(false)}
              >
                <ArrowBackIcon />
              </IconButton>
              {compactSearchBarVisibility && (
                <div className="grow">{searchBar}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseHeaderContext.Provider>
  );
};
