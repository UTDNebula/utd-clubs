'use server';

import { api } from '@src/trpc/server';
import NewSidebar from './Slide';

// Keep in mind that in all routes we need pl-72 for the sidebar
const Sidebar = async ({
  hamburger = 'black',
  shadow = false,
}: {
  hamburger?: 'white' | 'black';
  shadow?: boolean;
}) => {
  const userSidebarCapabilities =
    await api.userMetadata.getUserSidebarCapabilities();
  return (
    <NewSidebar
      userCapabilities={userSidebarCapabilities}
      hamburger={hamburger}
      shadow={shadow}
    />
  );
};

export default Sidebar;
