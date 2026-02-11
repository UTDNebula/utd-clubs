import Image from 'next/image';
import gradientBG from 'public/images/landingGradient.png';
import planetsDoodle from 'public/images/PlanetsDoodle.png';
import { AllTags } from '@src/components/AllTags';
import ClubDirectoryGrid from '@src/components/club/directory/ClubDirectoryGrid';
import Header from '@src/components/header/Header';
import { HomePageSearchBar } from '@src/components/searchBar/HomePageSearch';
import { TagPill } from '@src/components/TagPill';
import NebulaLogo from '@src/icons/NebulaLogo';
import StarDoodle from '@src/icons/StarDoodle';
import { api } from '@src/trpc/server';
import { SearchStoreProvider } from '@src/utils/SearchStoreProvider';

const Home = async () => {
  const tags = await api.club.topTags();
  const allTags = await api.club.distinctTags();

  return (
    <SearchStoreProvider>
      <main className="relative">
        <div className="absolute inset-0 z-0">
          <div className="relative h-[120vh]">
            <section className="absolute inset-0 z-0 h-[120vh]">
              <Image
                src={gradientBG}
                fill
                sizes="120vw"
                alt="Gradient Background"
                className="bg-no-repeat object-cover select-none"
              />
              <Image
                src={planetsDoodle}
                alt="Planets Doodle"
                width={574}
                height={200}
                className="hidden md:block absolute right-[10%] bottom-[30%] w-[clamp(200px,20vw,300px)] bg-no-repeat object-cover"
              />
              <StarDoodle className="w-18 h-18 fill-white absolute top-[15%] right-[15%] w-[clamp(56px,7vw,72px)] animate-spin [animation-direction:reverse] [animation-duration:77s]" />
              <StarDoodle className="w-12 h-12 fill-white hidden md:block absolute bottom-[35%] left-[10%] w-[clamp(32px,4vw,48px)] animate-spin [animation-duration:60s]" />
              <div className="absolute inset-0 dark:bg-slightly-darken" />
            </section>
            <section className="absolute top-[100vh] z-10 h-[20vh] w-full bg-linear-to-t from-[#f6f6f6] dark:from-[#101010] to-transparent"></section>
          </div>
        </div>
        <div className="relative inset-0 z-20 bg-transparent">
          <Header
            transparent
            shadow
            disableSticky
            className="lg:fixed"
            itemVisibility={{ search: false }}
            color="light"
          />
          <section className="h-screen">
            <div className="flex h-full w-full flex-col items-center justify-center overflow-visible">
              <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold tracking-wider text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]">
                <span className="leading-none">POWERED BY</span>
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
              <div className="pointer-events-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-2 gap-y-2 text-white">
                {tags.map((tag) => (
                  <TagPill
                    name={tag}
                    key={tag}
                    className="drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
                  />
                ))}
                <AllTags options={allTags} />
              </div>
            </div>
          </section>
          <section className="h-full w-full">
            <div className="px-2 md:px-5" id="content">
              <ClubDirectoryGrid />
            </div>
          </section>
        </div>
      </main>
    </SearchStoreProvider>
  );
};

export default Home;
