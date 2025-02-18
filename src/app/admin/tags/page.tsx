import TagSwapper from './tagSwapper';

export default function Page() {
  return (
    <div className="m-5 md:pl-72">
      <h1 className="text-center text-4xl font-bold text-black">Change tags</h1>
      <div className="flex justify-center gap-x-5 pt-20">
        <TagSwapper />
      </div>
    </div>
  );
}
