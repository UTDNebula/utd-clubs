'use client';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

type Props = {
  image: string;
};

export const ProfileDropDown = ({ image }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {image !== '' ? (
          <Image
            src={image}
            className="h-10 w-10 rounded-full bg-gray-300 shadow-xs"
            alt="Profile Image"
            height={40}
            width={40}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300" />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 w-48 rounded-md border-gray-300 bg-slate-200 text-center shadow-md transition-all">
          <DropdownMenu.Item className="p-3 transition-all hover:cursor-pointer hover:bg-slate-300">
            <Link href={'/settings'}>Settings</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="p-3 transition-all hover:cursor-pointer hover:bg-slate-300"
            onClick={() => void signOut()}
          >
            <button>Sign out</button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
