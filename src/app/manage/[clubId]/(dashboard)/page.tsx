import Link from 'next/link';

const Page = ({ params }: { params: { clubId: string } }) => {
  return (
    <>
      <div className="flex flex-row gap-x-1 rounded-lg bg-white p-2 shadow-xs">
        <Link
          href={`/manage/${params.clubId}/edit`}
          className="rounded-md bg-blue-primary p-1 font-semibold text-white"
        >
          Edit Club Data
        </Link>
        <Link
          href={`/manage/${params.clubId}/edit/officers`}
          className="rounded-md bg-blue-primary p-1 font-semibold text-white"
        >
          Manage Officers
        </Link>
        <button className="rounded-md bg-blue-primary p-1 font-semibold text-white">
          View members
        </button>
        <Link
          href={`/manage/${params.clubId}/create`}
          className="rounded-md bg-blue-primary p-1 font-semibold text-white"
        >
          Create Event
        </Link>
      </div>
    </>
  );
};
export default Page;
