'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMap, routeMap, type allCats } from '@src/constants/categories';

const SidebarItems = ({ cat }: { cat: allCats[number] }) => {
  const Icon = IconMap[cat];
  const route = routeMap[cat];
  const pathName = usePathname();
  const active = pathName === route;

  if (!route) return null;

  return (
    <Link
      className={`group flex items-center gap-x-4 rounded-full px-5 py-2.5 transition-colors duration-200 ${active ? 'bg-white shadow-md' : ''} hover:bg-cornflower-100 hover:shadow-md`}
      href={route}
      target={route.startsWith('http') ? '_blank' : ''}
    >
      {Icon && (
        <Icon
          fill={`${
            active ? 'fill-royal' : 'fill-slate-500'
          } group-hover:fill-royal`}
        />
      )}
      <h1
        className={`text-base font-medium capitalize md:text-sm ${active ? 'text-royal' : 'text-slate-500'} group-hover:text-royal`}
      >
        {cat}
      </h1>
    </Link>
  );
};

export default SidebarItems;
