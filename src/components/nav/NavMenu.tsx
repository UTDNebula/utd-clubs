'use client';

import Link from 'next/link';
import {
  mainCats,
  moreCats,
  type personalCats,
} from '@src/constants/categories';
import { UTDClubsLogoCombination } from '@src/icons/UTDClubsLogo';
import SidebarItems from './SidebarItems';

type NavMenuProps = {
  userCapabilites: Array<(typeof personalCats)[number]>;
  pendingClubsCount: number | null;
};

const NavMenu = ({ userCapabilites, pendingClubsCount }: NavMenuProps) => {
  return (
    <>
      {/* Logo Section */}
      <div className="flex w-full justify-center pt-14 pb-14">
        <Link className="flex items-center gap-2 select-none" href="/">
          <UTDClubsLogoCombination
            duotone
            className="h-16 w-auto"
            slotClassNames={{
              nebulaLogo: 'fill-haiti dark:fill-white',
              projectLogo: 'fill-royal dark:fill-cornflower-300',
            }}
          />
          <h1 className="font-display text-2xl font-bold">UTD CLUBS</h1>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="w-full px-6 py-4">
        <div className="flex flex-col space-y-4">
          {mainCats.map((cat) => (
            <SidebarItems key={cat} cat={cat} />
          ))}

          {userCapabilites.map((cat) => {
            if (cat === 'Admin') {
              return (
                <SidebarItems key={cat} cat={cat} badge={pendingClubsCount} />
              );
            }
            return <SidebarItems key={cat} cat={cat} />;
          })}

          {moreCats.map((cat) => (
            <SidebarItems key={cat} cat={cat} />
          ))}
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="w-full mt-auto px-6 py-2 flex flex-wrap gap-2 justify-evenly text-base font-medium capitalize md:text-sm text-slate-600 dark:text-slate-400">
        <Link
          className="underline decoration-transparent hover:decoration-inherit transition"
          href="https://www.utdnebula.com/legal/privacy-policy.txt"
        >
          Privacy Policy
        </Link>
        <Link
          className="underline decoration-transparent hover:decoration-inherit transition"
          href="/sitemap.xml"
        >
          Sitemap
        </Link>
      </div>
    </>
  );
};

export default NavMenu;
