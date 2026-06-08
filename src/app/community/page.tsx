import { type Metadata } from 'next';
import { RegisteredEvents } from './communityEvents';

export const metadata: Metadata = {
  title: 'My Events | My Community',
  description: 'View all your registered events.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community',
  },
  openGraph: {
    title: 'My Events | My Community',
    url: 'https://clubs.utdnebula.com/community',
    description: 'View all your registered events.',
  },
};

const Community = async () => {
  return <RegisteredEvents />;
};

export default Community;
