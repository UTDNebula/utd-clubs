import { type UseFormRegister } from 'react-hook-form';
import { type SettingSchema } from './FormCard';

type SettingsInputProps = {
  label: string;
  defaultValue: string;
  name: keyof SettingSchema;
  register: UseFormRegister<SettingSchema>;
};

const SettingsInput = ({
  label,
  defaultValue,
  name,
  register,
}: SettingsInputProps) => {
  return (
    <div className="mb-2">
      <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="box-border w-full rounded-full border bg-white dark:bg-neutral-900 p-2"
        {...register(name)}
      />
    </div>
  );
};

export default SettingsInput;
