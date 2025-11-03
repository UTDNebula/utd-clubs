import Image from 'next/image';
import gradientBG from 'public/images/landingGradient.png';
import planetsDoodle from 'public/images/PlanetsDoodle.png';
import ClubDirectoryGrid from '@src/components/club/directory/ClubDirectoryGrid';
import TagFilter from '@src/components/club/directory/TagFilter';
import ClubMatchButton from '@src/components/header/ClubMatchButton';
import { ProfileDropDown } from '@src/components/header/ProfileDropDown';
import ExploreButton from '@src/components/landing/ExploreButton';
import Sidebar from '@src/components/nav/Sidebar';
import { HomePageSearchBar } from '@src/components/searchBar/HomePageSearch';
import NebulaLogo from '@src/icons/NebulaLogo';
import { getServerAuthSession } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { SearchStoreProvider } from '@src/utils/SearchStoreProvider';

const Home = async () => {
  const tags = await api.club.mostUsedTags();
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
                alt="Planets Doodle for landing page"
                width={574}
                height={200}
                className="absolute right-[10%] bottom-[30%] w-[clamp(200px,20vw,300px)] bg-no-repeat object-cover"
              />
              <Image
                src="/images/StarDoodle.svg"
                alt="Star Doodle (top right) for landing page"
                width={72}
                height={72}
                className="absolute top-[15%] right-[15%] w-[clamp(56px,7vw,72px)] animate-spin bg-no-repeat object-cover [animation-direction:reverse] [animation-duration:77s]"
              />
              <Image
                src="/images/StarDoodle.svg"
                alt="Star Doodle (bottom left) for landing page"
                width={48}
                height={48}
                className="absolute bottom-[35%] left-[10%] w-[clamp(32px,4vw,48px)] animate-spin bg-no-repeat object-cover [animation-duration:60s]"
              />
            </section>
            <section className="absolute top-[100vh] z-10 h-[20vh] w-screen bg-linear-to-t from-[#edeff2] to-transparent"></section>
          </div>
        </div>
        <div className="relative inset-0 z-20 bg-transparent">
          <div className="pointer-events-none *:pointer-events-auto fixed top-0 z-20 flex w-full items-center justify-between p-2.5 md:p-5">
            <Sidebar hamburger="white" shadow />
            <div className="ml-auto flex items-center justify-center gap-2">
              <ClubMatchButton />
              <ProfileDropDown session={session} shadow />
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
