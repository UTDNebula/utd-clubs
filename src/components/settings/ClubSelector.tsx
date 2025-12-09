import Image from 'next/image';
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
} from 'react-hook-form';
import { type SettingSchema } from '@src/components/settings/FormCard';

type Props = {
  register: UseFormRegister<SettingSchema>;
  control: Control<SettingSchema>;
};

export default function ClubSelector({ control }: Props) {
  const { fields, remove } = useFieldArray({
    control,
    name: 'clubs',
    keyName: 'club.id',
  });
  return (
    <div className="-mt-4 max-w-2xl">
      <div className="flex w-full flex-wrap">
        {fields.map((club, i) => (
          <div
            className="m-2 flex min-w-[10rem] items-center justify-center rounded-full border p-2"
            key={club.id}
          >
            {club.profileImage && (
              <Image
                src={club.profileImage}
                alt={club.name + ' logo'}
                width={40}
                height={40}
                className="-pl-1 rounded-full pr-1"
              />
            )}
            <p className="truncate p-1 text-xs font-bold">{club.name}</p>

            <button
              type="button"
              className="ml-2 rounded-full px-1 text-xs font-bold text-black"
              onClick={() => remove(i)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
