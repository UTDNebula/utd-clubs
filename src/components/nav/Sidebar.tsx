'use server';

import { api } from '@src/trpc/server';
import { ContentComponentColor } from '../header/BaseHeader';
import NewSidebar from './Slide';

// Keep in mind that in all routes we need pl-72 for the sidebar
const Sidebar = async ({
  hamburgerColor = 'dark',
  shadow = false,
}: {
  hamburgerColor?: ContentComponentColor;
  shadow?: boolean;
}) => {
  const userSidebarCapabilities =
    await api.userMetadata.getUserSidebarCapabilities();
  return (
    <NewSidebar
      userCapabilities={userSidebarCapabilities}
      hamburgerColor={hamburgerColor}
      shadow={shadow}
    />
  );
};

export default Sidebar;
