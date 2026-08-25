import Avatar from '@mui/material/Avatar';
import Panel from '@nebula-library/components/Panel';
import { SelectUser } from '@/server/db/models';

type SettingsHeaderProps = {
  user?: Omit<SelectUser, 'image'> & Partial<Pick<SelectUser, 'image'>>;
};

export default function SettingsHeader({ user }: SettingsHeaderProps) {
  return (
    <Panel className="relative bg-linear-to-r from-[#5A49F7] from-[4.36%] via-[#9403D8] via-[49.74%] to-[#FD9365]">
      <div className="dark:bg-slightly-darken absolute inset-0" />
      <div className="z-10">
        <div className="flex gap-4 pl-2 max-sm:flex-col-reverse sm:flex-row">
          <div className="flex flex-col gap-2 text-shadow-[0_0_8px_rgb(0_0_0_/_0.4)]">
            <h1 className="font-display text-4xl font-semibold text-white max-sm:text-center">
              Settings
            </h1>
            <span className="text-xl text-white opacity-80 max-sm:text-center max-sm:text-lg">
              Manage your account preferences and followed clubs
            </span>
          </div>
          {user?.image && (
            <div className="drop-shadow-[0_0_16px_rgb(0_0_0_/_0.2)] max-sm:mx-auto sm:ml-auto">
              <Avatar src={user.image} className="h-18 w-18 rounded-full">
                {user.name.charAt(0)}
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
