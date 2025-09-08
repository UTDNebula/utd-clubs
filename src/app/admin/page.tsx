import Link from 'next/link';

export default function Page() {
  return (
    <div className="m-5">
      <h1 className="text-center text-4xl font-bold text-black">
        Jupiter Dashboard
      </h1>
      <div className="flex justify-center gap-x-5 pt-20">
        <Link
          href="/admin/clubs"
          className="rounded-md bg-slate-300 px-2 py-1 text-blue-500 transition-colors hover:bg-slate-400 hover:text-blue-600"
        >
          Manage Clubs
        </Link>
        <Link
          href="/admin/users"
          className="rounded-md bg-slate-300 px-2 py-1 text-blue-500 transition-colors hover:bg-slate-400 hover:text-blue-600"
        >
          Manage Users
        </Link>
        <Link
          href="/admin/carousel"
          className="rounded-md bg-slate-300 px-2 py-1 text-blue-500 transition-colors hover:bg-slate-400 hover:text-blue-600"
        >
          Manage Carousel
        </Link>
        <Link
          href="/admin/tags"
          className="rounded-md bg-slate-300 px-2 py-1 text-blue-500 transition-colors hover:bg-slate-400 hover:text-blue-600"
        >
          Change tags
        </Link>
      </div>
    </div>
  );
}
