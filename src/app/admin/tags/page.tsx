import TagSwapper from './tagSwapper';

export default function Page() {
  return (
    <>
      <h1 className="font-display text-center text-4xl font-bold text-haiti mt-5">
        Change Tags
      </h1>
      <div className="flex justify-center gap-x-5 mt-5">
        <TagSwapper />
      </div>
    </>
  );
}
