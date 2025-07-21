import Link from 'next/link';

export default function ClubMatchButton() {
  return (
    <Link
      href="/club-match/results"
      className="bg-blue-primary self-center rounded-full px-4 py-2 text-white shadow-md"
    >
      Club Match
    </Link>
  );
}
