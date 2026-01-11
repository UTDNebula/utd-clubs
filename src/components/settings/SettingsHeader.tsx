import Image from 'next/image';
import Panel from '@src/components/form/Panel';

type SettingsHeaderProps = {
  userImageURL?: string;
};

export default function SettingsHeader({ userImageURL }: SettingsHeaderProps) {
  return (
    <Panel className="bg-linear-to-r from-[#5A49F7] from-[4.36%] via-[#9403D8] via-[49.74%] to-[#FD9365]">
      <div className="flex gap-4 max-sm:flex-col-reverse sm:flex-row pl-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-semibold max-sm:text-center text-white">
            Settings
          </h1>
          <span className="text-xl max-sm:text-lg max-sm:text-center text-white opacity-80">
            Manage your account preferences and joined clubs
          </span>
        </div>
        {userImageURL && (
          <div className="max-sm:mx-auto sm:ml-auto">
            <Image
              src={userImageURL}
              alt="Profile logo"
              width={72}
              height={72}
              className="rounded-full"
            />
          </div>
        )}
      </div>
    </Panel>
  );
}
