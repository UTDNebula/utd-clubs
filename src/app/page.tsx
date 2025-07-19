import TagFilter from '../components/club/directory/TagFilter';
import ClubDirectoryGrid from '../components/club/directory/ClubDirectoryGrid';
import type { Metadata } from 'next';
import { api } from '@src/trpc/server';
import Image from 'next/image';
import gradientBG from 'public/images/landingGradient.png';
import SignInButton from '@src/components/header/signInButton';
import ExploreButton from '@src/components/landing/ExploreButton';
import Sidebar from '@src/components/nav/Sidebar';
import { getServerAuthSession } from '@src/server/auth';
import { ProfileDropDown } from '@src/components/header/ProfileDropDown';
import { SearchStoreProvider } from '@src/utils/SearchStoreProvider';
import { HomePageSearchBar } from '@src/components/searchBar/HomePageSearch';
export const metadata: Metadata = {
  title: 'Jupiter - Nebula',
  description: 'Get connected on campus.',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com',
    description: 'Jupiter - Nebula Labs',
  },
};

const Home = async () => {
  const tags = await api.club.distinctTags();
  // const featured = await api.club.getCarousel();
  // const onlyClubs = featured.map((item) => item.club);
  const session = await getServerAuthSession();
  return (
    <SearchStoreProvider>
      <main className="relative bg-white">
        {/* <Header /> */}
        <div title="background-shenanigans" className="absolute inset-0 z-0">
          <div className="relative h-[120vh] w-screen">
            <section
              title="gradient"
              className="absolute inset-0 z-0 h-[120vh] w-screen"
            >
              <Image
                src={gradientBG}
                fill
                sizes="120vw"
                alt="Gradient Background for landing page"
                className="bg-no-repeat object-cover"
              />
            </section>
            <section
              title="blend"
              className="absolute top-[100vh] z-10 h-[20vh] w-screen bg-linear-to-t from-white to-transparent"
            ></section>
          </div>
        </div>
        <div title="content" className="relative inset-0 z-20 bg-transparent">
          <div className="pointer-events-none fixed top-0 z-20 flex h-20 w-full flex-row items-center px-2.5 py-2.5 md:px-5">
            <Sidebar hamburger="black" />
            <div className="pointer-events-auto ml-auto flex items-center justify-center">
              {session !== null ? (
                <div className="h-10 w-10 rounded-full">
                  <ProfileDropDown image={session.user.image || ''} />
                </div>
              ) : (
                <div className="mr-2">
                  <SignInButton />
                </div>
              )}
            </div>
          </div>
          <section className="h-screen w-screen">
            <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center overflow-visible">
              <h2 className="pointer-events-auto mb-2 max-w-xl text-lg text-white md:text-2xl">
                Powered by nebula labs
              </h2>
              <h1 className="pointer-events-auto mb-4 max-w-3xl px-5 text-center font-sans text-2xl font-semibold text-white md:px-0 md:text-6xl">
                Discover the Best Clubs and Organizations at UTD
              </h1>
              <HomePageSearchBar />
            </div>
          </section>
          <section className="absolute left-1/2 -translate-x-1/2">
            <ExploreButton />
          </section>
          <section className="h-full w-full">
            <div className="px-2 md:px-5" id="content">
              <TagFilter tags={tags} />
              <ClubDirectoryGrid session={session} />
            </div>
          </section>
        </div>
      </main>
    </SearchStoreProvider>
  );
};

export default Home;
