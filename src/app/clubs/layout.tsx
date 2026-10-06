import Header from '@/lib/modules/navigation/header';
import ClubDirectoryHeader from '@/systems/clubs/ClubDirectoryHeader';

export default function ClubsLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto mb-8 flex max-w-6xl flex-col sm:px-4">
        <ClubDirectoryHeader />
      </main>
    </>
  );
}
