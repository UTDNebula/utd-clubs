import TagFilter from '../components/club/directory/TagFilter';
import ClubDirectoryGrid from '../components/club/directory/ClubDirectoryGrid';
import type { Metadata } from 'next';
import { api } from '@src/trpc/server';
import Image from 'next/image';
import gradientBG from 'public/images/landingGradient.png';
import starDoodle from 'public/images/StarDoodle.png';
import planetsDoodle from 'public/images/PlanetsDoodle.png';
import SignInButton from '@src/components/header/signInButton';
import ExploreButton from '@src/components/landing/ExploreButton';
import Sidebar from '@src/components/nav/Sidebar';
import NebulaLogo from '@src/icons/NebulaLogo';
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
      <main className="relative">
        {/* <Header /> */}
        <div className="absolute inset-0">
          <div className="relative h-[120vh] w-screen">
            <section className="absolute inset-0 h-[120vh] w-screen">
              <Image
                src={gradientBG}
                fill
                sizes="120vw"
                alt="Gradient Background for landing page"
                className="bg-no-repeat object-cover"
              />
              <Image
                src={planetsDoodle}
                //width={300}
                //height={300}
                alt="Planets Doodle for landing page"
                className="absolute right-[10%] bottom-[30%] w-[clamp(200px,20vw,300px)] bg-no-repeat object-cover"
              />
              <Image
                src={starDoodle}
                //width={170}
                //height={170}
                alt="Star Doodle (top right) for landing page"
                className="absolute top-[5%] right-[15%] w-[clamp(170px,20vw,200px)] animate-spin bg-no-repeat object-cover [animation-direction:reverse] [animation-duration:77s]"
              />
              <Image
                src={starDoodle}
                //width={140}
                //height={140}
                alt="Star Doodle (upper right) for landing page"
                className="absolute bottom-[35%] left-[7%] w-[clamp(70px,20vw,150px)] animate-spin bg-no-repeat object-cover [animation-duration:60s]"
              />
            </section>
            <section className="absolute top-[100vh] z-10 h-[20vh] w-screen bg-linear-to-t from-white to-transparent"></section>
          </div>
        </div>
        <div className="relative inset-0 z-20 bg-transparent">
          <div className="pointer-events-none fixed top-0 z-20 flex h-20 w-full flex-row items-center px-2.5 py-2.5 md:px-5">
            <Sidebar hamburger="white" />
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
            <div className="flex h-full w-full flex-col items-center justify-center overflow-visible">
              <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold tracking-wider text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]">
                <span className="leading-none">POWERED BY</span>
                {/*eslint-disable-next-line react/jsx-no-target-blank*/}
                <a
                  href="https://www.utdnebula.com/"
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center gap-1"
                >
                  <NebulaLogo className="h-4 w-auto fill-white drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]" />
                  <span className="border-y-2 border-transparent leading-none decoration-transparent transition group-hover:border-b-inherit group-hover:underline">
                    NEBULA LABS
                  </span>
                </a>
              </h2>
              <h1 className="font-display mb-4 max-w-3xl px-5 text-center text-2xl font-semibold text-white text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)] md:px-0 md:text-6xl">
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
