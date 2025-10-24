import { type SettingSchema } from './FormCard';
import { type UseFormRegister } from 'react-hook-form';

type SettingsDropdownProps = {
  options: string[];
  label: string;
  disabled?: boolean;
  defaultValue: string;
  name: keyof SettingSchema;
  register: UseFormRegister<SettingSchema>;
};

const SettingsDropdown = ({
  options,
  label,
  disabled,
  defaultValue,
  name,
  register,
}: SettingsDropdownProps) => {
  return (
    <div className="mb-2">
      <label className="mb-2 text-sm font-medium text-slate-500">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-full border p-2 disabled:opacity-50"
        disabled={disabled}
        {...register(name)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default SettingsDropdown;
