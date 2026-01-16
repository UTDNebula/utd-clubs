'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMap, routeMap, type allCats } from '@src/constants/categories';

const SidebarItems = ({ cat }: { cat: allCats[number] }) => {
  const Icon = IconMap[cat];
  const route = routeMap[cat];
  const pathName = usePathname();
  const active =
    route && route !== '/'
      ? pathName.startsWith(route)
      : pathName === '/'
        ? true
        : false;

  if (!route) return null;

  return (
    <Link
      className={`group flex items-center gap-x-4 rounded-full px-5 py-2.5 transition-colors duration-200 ${active ? 'bg-white dark:bg-neutral-900 shadow-md hover:shadow-royal/10 dark:hover:shadow-cornflower-300/10' : ''} hover:bg-royal/10 dark:hover:cornflower-300/10`}
      href={route}
      target={route.startsWith('http') ? '_blank' : ''}
    >
      {Icon && (
        <Icon
          className={`${
            active
              ? 'fill-royal dark:fill-cornflower-300'
              : 'fill-slate-800 dark:fill-slate-200'
          } group-hover:fill-royal dark:group-hover:fill-cornflower-300`}
        />
      )}
      <h2
        className={`text-base font-medium capitalize md:text-sm ${active ? 'text-royal dark:text-cornflower-300' : 'text-slate-800 dark:text-slate-200'} transition-colors group-hover:text-royal dark:group-hover:text-cornflower-300`}
      >
        {cat}
      </h2>
    </Link>
  );
};

export default SidebarItems;
