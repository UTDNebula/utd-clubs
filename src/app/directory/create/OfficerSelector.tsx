import { type createClubSchema } from '@src/utils/formSchemas';
import {
  type Control,
  type UseFieldArrayRemove,
  type UseFormRegister,
  useFieldArray,
  type FieldErrors,
} from 'react-hook-form';
import { type z } from 'zod';
import { UserSearchBar } from '@src/components/searchBar/UserSearchBar';

type OfficerSelectorProps = {
  control: Control<z.infer<typeof createClubSchema>>;
  register: UseFormRegister<z.infer<typeof createClubSchema>>;
  errors: FieldErrors<z.infer<typeof createClubSchema>>;
};
const OfficerSelector = ({
  control,
  register,
  errors,
}: OfficerSelectorProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'officers',
  });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row py-1">
        <h2>Officers</h2>
      </div>
      <div>
        <UserSearchBar
          passUser={(user) => {
            append({
              id: user.id,
              name: user.name,
              position: '',
              president: false,
              locked: false,
            });
          }}
        />
      </div>
      <div>
        {errors.officers && (
          <p className="text-red-500">{errors.officers.message}</p>
        )}
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <OfficerItem
            key={field.id}
            register={register}
            index={index}
            remove={remove}
            errors={errors}
            locked={field.locked}
            name={field.name}
          />
        ))}
      </div>
    </div>
  );
};
export default OfficerSelector;

type OfficerItemProps = {
  register: UseFormRegister<z.infer<typeof createClubSchema>>;
  remove: UseFieldArrayRemove;
  index: number;
  name: string;
  locked: boolean;
  errors: FieldErrors<z.infer<typeof createClubSchema>>;
};
const OfficerItem = ({
  register,
  index,
  name,
  remove,
  errors,
  locked,
}: OfficerItemProps) => {
  return (
    <div className="flex flex-row items-center rounded-md bg-slate-300 p-2">
      <div className="flex flex-col">
        <div>
          <h4 className="mb-1 bg-slate-300 text-xl font-bold text-black">
            {name}
          </h4>
        </div>
        <div>
          <input
            type="text"
            placeholder="Position"
            className="bg-slate-300 font-semibold text-black"
            {...register(`officers.${index}.position` as const)}
            aria-invalid={errors.officers && !!errors.officers[index]?.position}
            disabled={locked}
          />
          {errors.officers && errors.officers[index]?.position && (
            <p className="text-red-500">
              {errors.officers[index]?.position?.message}
            </p>
          )}
        </div>
      </div>
      <button
        className="ml-auto disabled:hidden"
        type="button"
        onClick={() => remove(index)}
        disabled={locked}
      >
        remove
      </button>
    </div>
  );
};
