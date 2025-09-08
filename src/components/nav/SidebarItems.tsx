'use client';
import { usePathname } from 'next/navigation';
import { IconMap, type allCats, routeMap } from '@src/constants/categories';
import Link from 'next/link';

const SidebarItems = ({ cat }: { cat: allCats[number] }) => {
  const Icon = IconMap[cat];
  const route = routeMap[cat];
  const pathName = usePathname();
  const active = pathName === route;

  // This should never happen
  // Just so  TS doesn't complain
  if (!route) return null;

  return (
    <Link
      className={`group block flex items-center gap-x-4 rounded-full px-5 ${
        active
          ? '-my-2.5 mb-2.5 bg-white py-2.5 shadow-md last:-mb-2.5'
          : 'mb-5'
      } hover:-my-2.5 hover:mb-2.5 hover:bg-white hover:py-2.5 hover:shadow-md hover:last:-mb-2.5`}
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
        className={`text-base font-medium capitalize md:text-sm ${
          active ? 'text-blue-primary' : 'text-slate-500'
        } group-hover:text-blue-primary`}
      >
        {cat}
      </h1>
    </Link>
  );
};

export default SidebarItems;
