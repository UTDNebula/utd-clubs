import { type Metadata } from 'next';
import React from 'react';
import Form from '@src/app/feedback/Form';
import Header from '@src/components/header/BaseHeader';

export const metadata: Metadata = {
  title: 'Feedback',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/feedback',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/feedback',
  },
};

const Feedback = () => {
  return (
    <main className="h-full">
      <Header />

      <div className="mb-20 flex h-full w-full flex-row">
        <section className="justift-center m-auto mt-3 items-center rounded-lg bg-white px-10 py-6 text-center shadow-lg">
          <Form />
        </section>
      </div>
    </main>
  );
};

export default Feedback;
