'use client';

import PageHeader from '@/lib/components/PageHeader';

export default function PoliciesHeader() {
  return (
    <PageHeader
      title="Policies"
      tabs={[
        { label: 'Privacy Policy', href: '/policies/privacy' },
        { label: 'Terms of Service', href: '/policies/terms' },
        { label: 'FAQ', href: '/policies/faq' },
      ]}
      slotProps={{
        tabs: {
          variant: 'scrollable',
          scrollButtons: 'auto',
          'aria-label': 'Policies navigation',
        },
      }}
    />
  );
}
