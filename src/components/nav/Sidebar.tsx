'use server';
import { api } from '@src/trpc/server';
import NewSidebar from './Slide';

// Keep in mind that in all routes we need pl-72 for the sidebar
const Sidebar = async ({ hamburger }: { hamburger?: 'white' | 'black' }) => {
  const userSidebarCapabilities =
    await api.userMetadata.getUserSidebarCapabilities();
  return (
    <NewSidebar
      userCapabilities={userSidebarCapabilities}
      hamburger={hamburger ?? 'black'}
    />
  );
};

export default Sidebar;
