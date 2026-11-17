import { ReactNode } from 'react';
import Header from '@/lib/modules/navigation/header';
import PoliciesHeader from '@/systems/policies/PoliciesHeader';

export default function PoliciesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto mb-8 flex max-w-4xl flex-col px-4">
        <PoliciesHeader />
        {children}
      </main>
    </>
  );
}
