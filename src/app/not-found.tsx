import { type Metadata } from 'next';
import NotFound from '@src/components/NotFound';

export const metadata: Metadata = {
  title: 'Page Not Found - Jupiter',
  description: 'Page does not exist.',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/404',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/404',
    description: 'Page does not exist.',
  },
};

const error = () => {
  return <NotFound elementType="Page" />;
};

export default error;
