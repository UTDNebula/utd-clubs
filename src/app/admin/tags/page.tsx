import TagSwapper from './tagSwapper';

export default function Page() {
  return (
    <div className="m-5">
      <h1 className="text-center text-4xl font-bold text-haiti">Change Tags</h1>
      <div className="flex justify-center gap-x-5 pt-20">
        <TagSwapper />
      </div>
    </div>
  );
}
