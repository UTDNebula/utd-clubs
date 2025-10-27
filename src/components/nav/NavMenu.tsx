'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  mainCats,
  moreCats,
  type personalCats,
} from '@src/constants/categories';
import SidebarItems from './SidebarItems';

type NavMenuProps = {
  userCapabilites: Array<(typeof personalCats)[number]>;
};

const NavMenu = ({ userCapabilites }: NavMenuProps) => {
  return (
    <>
      {/* Logo Section */}
      <div className="flex w-full justify-center pt-14 pb-14">
        <Link className="flex items-center gap-2" href="/">
          <Image src="/nebula-logo.png" alt="Logo" width={60} height={60} />
          <h1 className="text-2xl font-semibold">Jupiter</h1>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="w-full px-6 py-4">
        <div className="flex flex-col space-y-4">
          {mainCats.map((cat) => (
            <SidebarItems key={cat} cat={cat} />
          ))}

          {userCapabilites.map((cat) => (
            <SidebarItems key={cat} cat={cat} />
          ))}

          {moreCats.map((cat) => (
            <SidebarItems key={cat} cat={cat} />
          ))}
        </div>
      </div>
    </>
  );
};

export default NavMenu;
