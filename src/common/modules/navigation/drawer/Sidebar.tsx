'use server';

import type { ContentComponentColor } from '@/common/modules/navigation/header/BaseHeader';
import { api } from '@/trpc/server';
import NewSidebar from './Slide';

// Keep in mind that in all routes we need pl-72 for the sidebar
const Sidebar = async ({
  homepage = false,
  hamburgerColor = 'darkLight',
}: {
  homepage?: boolean;
  hamburgerColor?: ContentComponentColor;
}) => {
  const userSidebarCapabilities =
    await api.userMetadata.getUserSidebarCapabilities();
  let pendingClubsCount = null;
  if (userSidebarCapabilities.includes('Admin')) {
    pendingClubsCount = await api.admin.pendingClubsCount();
  }
  return (
    <NewSidebar
      userCapabilities={userSidebarCapabilities}
      pendingClubsCount={pendingClubsCount}
      homepage={homepage}
      hamburgerColor={hamburgerColor}
    />
  );
};

export default Sidebar;
