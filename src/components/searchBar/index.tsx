import { TextField, TextFieldProps } from '@mui/material';

type SearchBarProps = TextFieldProps & {
  submitLogic?: () => void;
};

export const SearchBar = (props: SearchBarProps) => {
  const { submitLogic, ...goodProps } = props;
  return (
    <TextField
      {...goodProps}
      size="small"
      className="w-full"
      slotProps={{
        input: {
          sx: {
            background: 'white',
            borderRadius: 'calc(infinity * 1px)',
          },
        },
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && typeof submitLogic !== 'undefined') {
          submitLogic();
        }
      }}
    />
  );
};
export default SearchBar;
