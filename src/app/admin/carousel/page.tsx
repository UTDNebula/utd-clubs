import CarouselCard from '@src/components/admin/CarouselCards';
import { api } from '@src/trpc/server';
import Link from 'next/link';

export default async function Page() {
  const carouselItems = await api.club.getCarousel();
  const upcoming = await api.admin.upcomingCarousels();
  return (
    <div className="m-5 ">
      <h1 className="mb-10 text-center text-4xl font-bold text-gray-800">
        Current Carousel Items
      </h1>
      <div className="mb-10 flex justify-center gap-5">
        <Link
          className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          href="/admin/carousel/add"
        >
          Add Carousel Item
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {carouselItems.map(
          (item) => item.club && <CarouselCard item={item} key={item.orgId} />,
        )}
      </div>
      <h1 className="mb-10 pt-5 text-center text-4xl font-bold text-gray-800">
        Upcoming Carousel Items
      </h1>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {upcoming.map(
          (item) => item.club && <CarouselCard item={item} key={item.orgId} />,
        )}
      </div>
    </div>
  );
}
