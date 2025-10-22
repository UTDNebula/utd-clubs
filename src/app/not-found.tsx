import NotFound from '@src/components/NotFound';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'Page does not exist.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/404',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/404',
    description: 'Page does not exist.',
  },
};

const error = () => {
  return <NotFound elementType="Page" />;
};

export default error;
