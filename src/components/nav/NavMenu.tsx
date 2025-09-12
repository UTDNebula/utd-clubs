'use client';
import SidebarItems from './SidebarItems';
import Image from 'next/image';
import {
  mainCats,
  moreCats,
  type personalCats,
} from '@src/constants/categories';
import Link from 'next/link';
type NavMenuProps = {
  userCapabilites: Array<(typeof personalCats)[number]>;
};
const NavMenu = ({ userCapabilites }: NavMenuProps) => {
  return (
    <>
      <div className="flex w-full justify-center pt-10 pb-7">
        <Link className="flex items-center gap-1.5" href="/">
          <Image src="/nebula-logo.png" alt="" width={60} height={60} />
          <h1 className="text-2xl font-display font-bold">Jupiter</h1>
        </Link>
      </div>
      <div className="w-full px-5 py-5">
        <h1 className="px-4 text-sm font-light text-slate-500 capitalize md:text-xs">
          Main
        </h1>
        <div className="mt-6 mb-5">
          {mainCats.map((cat) => (
            <SidebarItems key={cat} cat={cat} />
          ))}
        </div>
      </div>
      <div className="w-full py-5 pl-5 md:p-5">
        <h1 className="px-4 text-sm font-light text-slate-500 capitalize md:text-xs">
          More
        </h1>
        <div className="mt-6 mb-5">
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
