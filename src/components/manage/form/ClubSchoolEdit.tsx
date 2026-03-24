'use client';

import SchoolIcon from '@mui/icons-material/School';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { TagChip } from '@src/components/common/TagChip';

const UTD_SCHOOLS = [
  'Harry W. Bass Jr. School of Arts, Humanities, and Technology',
  'School of Behavioral and Brain Sciences',
  'School of Economic, Political and Policy Sciences',
  'Erik Jonsson School of Engineering and Computer Science',
  'School of Interdisciplinary Studies',
  'Naveen Jindal School of Management',
  'School of Natural Sciences and Mathematics',
] as const;

const filter = createFilterOptions<string>({});

export const ClubSchoolEdit = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  error?: boolean;
  helperText?: string;
}) => {
  return (
    <Autocomplete
      disableCloseOnSelect
      disableClearable
      multiple
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur
      aria-label="schools"
      value={value}
      options={UTD_SCHOOLS as unknown as string[]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search schools"
          label="Schools"
          className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
          error={error}
          helperText={helperText}
        />
      )}
      renderValue={(value, getItemProps) => {
        return value.map((option: string, index: number) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <TagChip
              key={key}
              icon={<SchoolIcon color="inherit" />}
              tag={option}
              {...itemProps}
            />
          );
        });
      }}
      filterOptions={(options, params) => filter(options, params)}
      onChange={(_e, value) => onChange(value)}
      onBlur={onBlur}
    />
  );
};