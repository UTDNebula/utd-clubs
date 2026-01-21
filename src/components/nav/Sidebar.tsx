'use server';

import type { ContentComponentColor } from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';
import NewSidebar from './Slide';

// Keep in mind that in all routes we need pl-72 for the sidebar
const Sidebar = async ({
  homepage = false,
  hamburgerColor = 'dark',
}: {
  homepage?: boolean;
  hamburgerColor?: ContentComponentColor;
}) => {
  const userSidebarCapabilities =
    await api.userMetadata.getUserSidebarCapabilities();
  return (
    <NewSidebar
      userCapabilities={userSidebarCapabilities}
      homepage={homepage}
      hamburgerColor={hamburgerColor}
    />
  );
};

export default Sidebar;
