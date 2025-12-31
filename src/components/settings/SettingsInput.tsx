import { type UseFormRegister } from 'react-hook-form';
import { AccountSettingsSchema } from '@src/utils/formSchemas';

type SettingsInputProps = {
  label: string;
  defaultValue: string;
  name: keyof AccountSettingsSchema;
  register: UseFormRegister<AccountSettingsSchema>;
};

const SettingsInput = ({
  label,
  defaultValue,
  name,
  register,
}: SettingsInputProps) => {
  return (
    <div className="mb-2">
      <label className="mb-2 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="box-border w-full rounded-full border bg-white p-2"
        {...register(name)}
      />
    </div>
  );
};

export default SettingsInput;
