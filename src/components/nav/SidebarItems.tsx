'use client';
import { usePathname } from 'next/navigation';
import { IconMap, type allCats, routeMap } from '@src/constants/categories';
import Link from 'next/link';

const SidebarItems = ({ cat }: { cat: allCats[number] }) => {
  const Icon = IconMap[cat];
  const route = routeMap[cat];
  const pathName = usePathname();
  const active = pathName === route;

  if (!route) return null;

  return (
    <Link
      className={`group flex items-center gap-x-4 rounded-full px-5 py-2.5 transition-colors duration-200
        ${active ? 'bg-white shadow-md' : ''}
        hover:bg-white hover:shadow-md`}
      href={route}
    >
      {Icon && (
        <Icon
          fill={`${
            active ? 'fill-blue-primary' : 'fill-slate-500'
          } group-hover:fill-blue-primary`}
        />
      )}
      <h1
        className={`text-base font-medium capitalize md:text-sm
          ${active ? 'text-blue-primary' : 'text-slate-500'}
          group-hover:text-blue-primary`}
      >
        {cat}
      </h1>
    </Link>
  );
};

export default SidebarItems;
