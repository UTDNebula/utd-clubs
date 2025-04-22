import React from 'react';
import Header from '@src/components/header/BaseHeader';
import { type Metadata } from 'next';
import Form from '@src/app/feedback/Form';

export const metadata: Metadata = {
  title: 'Feedback - Jupiter',
  description: 'Get connected on campus.',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/feedback',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/feedback',
    description: 'Get connected on campus.',
  },
};

const Feedback = () => {
  return (
    <main className="h-full  ">
      <Header />

      <div className="mb-20 flex h-full w-full flex-row ">
        <section className="justift-center m-auto mt-3 items-center rounded-lg bg-white px-10 py-6 text-center shadow-lg">
          <Form />
        </section>
      </div>
    </main>
  );
};

export default Feedback;
