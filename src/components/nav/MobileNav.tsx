'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { useState } from 'react';

import NavMenu from './NavMenu';
import { type personalCats } from '@src/constants/categories';

type NavMenuProps = {
  userCapabilites: Array<(typeof personalCats)[number]>;
};
const MobileNav = ({ userCapabilites }: NavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen)
    return (
      <div className="md:hiidden block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-black-500 hover:text-black-400 flex items-center rounded px-3 py-1 ${
            isOpen ? 'hidden' : 'block'
          }`}
        >
          <svg
            className={`${isOpen ? 'hidden' : 'block'} h-7 w-7 fill-black`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
    );

  return (
    <MobileNavMenu setIsOpen={setIsOpen} userCapabilites={userCapabilites} />
  );
};

const MobileNavMenu = ({
  setIsOpen,
  userCapabilites,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userCapabilites: Array<(typeof personalCats)[number]>;
}) => {
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        className="fixed left-0 top-0 z-50 h-screen w-full bg-black bg-opacity-50"
      ></div>
      <nav className="p-y md:hiidden fixed left-0 top-0 z-50 h-screen w-72 bg-slate-100">
        <NavMenu userCapabilites={userCapabilites} />
      </nav>
    </>
  );
};
export default MobileNav;
