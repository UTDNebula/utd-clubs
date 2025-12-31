import Panel from '@src/components/form/Panel';

export default function SettingsHeader() {
  return (
    <Panel className="bg-linear-to-r from-[#5A49F7] from-[4.36%] via-[#9403D8] via-[49.74%] to-[#FD9365]">
      <div className="pl-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-semibold max-sm:text-center text-white">
            Settings
          </h1>
          <span className="text-xl max-sm:text-lg max-sm:text-center text-white opacity-80">
            Manage your account preferences and joined clubs
          </span>
        </div>
      </div>
    </Panel>
  );
}
