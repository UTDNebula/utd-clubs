'use client';
import { type FC, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IconMap, type allCats, routeMap } from '@src/constants/categories';

const SidebarItems: FC<{ cat: allCats[number] }> = ({ cat }) => {
  const Icon = IconMap[cat];
  const router = useRouter();
  const route = routeMap[cat];
  const pathName = usePathname();
  const active = pathName === route;

  const [mouseOver, setMouseOver] = useState(false);
  const handleMouseOver = () => {
    setMouseOver(true);
  };

  const handleMouseOut = () => {
    setMouseOver(false);
  };

  // This should never happen
  // Just so  TS doesn't complain
  if (!route) return null;

  return (
    <div
      className={`group ${
        active || mouseOver
          ? `-my-2.5 mb-2.5 rounded-3xl bg-white py-2.5 shadow-md last:-mb-2.5`
          : 'mb-5'
      }`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div
        className=" 
        flex h-full w-full cursor-pointer items-start rounded-lg bg-transparent px-5 text-base transition-transform md:w-64 md:text-sm"
        onClick={() => void router.push(route)}
      >
        <div className="flex items-center gap-x-4">
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
        </div>
      </div>
    </div>
  );
};

export default SidebarItems;
