import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import {
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';

type ViewOptionItemBase<Value = string> = {
  label?: string;
  value: NonNullable<Value>;
  icon?: ReactNode;
};

export type ViewOptionItem<Value = string> = ViewOptionItemBase<Value> | Value;

type ViewOptionProps<Value> = {
  /**
   * Name of the item
   */
  title?: string;
  icon?: ReactNode;
  /**
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Controls behavior of the button
   * - `"select"` Opens a menu with the options
   * - `"cycle"` Cycles through the options on click
   */
  type?: 'select' | 'cycle';
  options?: ViewOptionItem<Value>[];
  /**
   * @default false
   */
  dropdownIcon?: boolean;
  /**
   * What the label text should contain (if {@linkcode iconOnly} is `false`)
   * @default "both"
   */
  labelContents?: 'both' | 'title' | 'value';
  defaultValue?: Value;
  value?: Value;
  onChange?: (value?: Value) => void;
};

export default function ViewOption<Value>({
  title,
  icon,
  iconOnly = false,
  type = 'select',
  options: optionsProp,
  dropdownIcon = false,
  labelContents = 'both',
  defaultValue,
  value,
  onChange,
}: ViewOptionProps<Value>) {
  const options: ViewOptionItemBase<Value>[] | undefined = optionsProp?.flatMap(
    (option) => {
      if (option) {
        if (typeof option === 'object' && 'value' in option) {
          return option;
        } else {
          return { value: option };
        }
      } else {
        return [];
      }
    },
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (type === 'select') {
      setAnchorEl(e.currentTarget);
    } else if (type === 'cycle' && options) {
      cycleIndex.current++;
      setSelected(options[cycleIndex.current % options.length]);
    }
  };

  const cycleIndex = useRef(
    defaultValue
      ? (options?.findIndex((option) => option.value === defaultValue) ?? 0)
      : 0,
  );

  const [selectedUncontrolled, setSelectedUncontrolled] = useState<
    ViewOptionItemBase<Value> | undefined
  >(
    defaultValue
      ? options?.find((option) => option.value === defaultValue)
      : undefined,
  );

  const selected =
    options?.find((option) => option.value === value) ?? selectedUncontrolled;
  const setSelected = useCallback(
    (action: SetStateAction<typeof selected>) => {
      const newValue = typeof action === 'function' ? action(selected) : action;
      setSelectedUncontrolled(action);
      onChange?.(newValue?.value);
    },
    [onChange, selected],
  );

  const labelHasTitle =
    (labelContents === 'both' || labelContents === 'title') && title;
  const labelHasValue =
    (labelContents === 'both' || labelContents === 'value') && selected?.label;
  const labelText = `${labelHasTitle ? title : ''}${labelHasValue ? `${labelHasTitle ? `: ` : ''}${selected?.label}` : !labelHasTitle ? 'None' : ''}`;

  return (
    <>
      {iconOnly ? (
        <Tooltip title={labelText} disableInteractive>
          <IconButton
            id={`${title}-dropdown`}
            size="small"
            className="aspect-square text-neutral-600 dark:text-neutral-400 *:text-[18px]"
            onClick={handleClick}
            aria-controls={openMenu ? `${title}-menu` : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
          >
            {selected?.icon ?? icon ?? <CropSquareIcon />}
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          id={`${title}-dropdown`}
          size="small"
          color="inherit"
          className="normal-case px-3 whitespace-nowrap min-h-8"
          startIcon={selected?.icon ?? icon}
          endIcon={dropdownIcon ? <ArrowDropDownIcon /> : undefined}
          onClick={handleClick}
          aria-controls={openMenu ? `${title}-menu` : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? 'true' : undefined}
        >
          {labelText}
        </Button>
      )}
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            'aria-labelledby': `${title}-dropdown`,
          },
        }}
      >
        {options?.map((option, index) => (
          <MenuItem
            key={option.label ?? index}
            onClick={() => {
              setSelected(option);
              handleCloseMenu();
            }}
            selected={selected?.value === option.value}
          >
            {option.label ?? String(option.value)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
