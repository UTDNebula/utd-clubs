import BlockIcon from '@mui/icons-material/Block';
import { IconButton, ListItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import { useState } from 'react';

export type FilterListItem = {
  label?: string;
  value: string;
};

export type FilterListProps = {
  /**
   * Controls the type of the selection list
   * - "checkbox" - Any number of options can be selected
   * - "radio" - Only one option can be selected at a time
   * @default "checkbox"
   */
  type?: 'checkbox' | 'radio';
  /**
   * Array of list options
   */
  options: (FilterListItem | string)[];
  /**
   * Array of list values that correspond to selected options. Used to control the component
   */
  selectedValues?: FilterListItem['value'][];
  /**
   * Array of list values that correspond to excluded options. Used to control the component
   */
  excludedValues?: FilterListItem['value'][];
  /**
   * Callback function that provides the updated selectedValues and excludedValues whenever
   * the user changes their selection. Used to raise the component's state
   * @param newSelectedValues Updated array of values that correspond to selected options
   * @param newExcludedValues Updated array of values that correspond to excluded options
   */
  onChange?: (
    newSelectedValues: FilterListItem['value'][],
    newExcludedValues: FilterListItem['value'][],
  ) => void;
  /**
   * Whether to enable the exclusion buttons
   */
  enableExclusion?: boolean;
  /**
   * When `type` prop is "radio", this allows users to deselect their choice
   * @default true
   */
  allowDeselecting?: boolean;
};

export default function FilterList({
  type = 'checkbox',
  options: optionsProp,
  selectedValues,
  excludedValues,
  onChange,
  enableExclusion = false,
  allowDeselecting = true,
}: FilterListProps) {
  const [selected, setSelected] = useState<FilterListItem['value'][]>(
    selectedValues ?? [],
  );
  const [excluded, setExcluded] = useState<FilterListItem['value'][]>(
    excludedValues ?? [],
  );

  const handleToggle = (item: FilterListItem) => () => {
    switch (type) {
      case 'checkbox':
        const currentIndex = selected.indexOf(item.value);
        const newSelected = [...selected];

        if (currentIndex === -1) {
          newSelected.push(item.value);
        } else {
          newSelected.splice(currentIndex, 1);
        }

        setSelected(newSelected);
        setExcluded((prev) => prev.filter((ele) => ele !== item.value));

        break;
      case 'radio':
        if (allowDeselecting && selected.includes(item.value)) {
          setSelected([]);
        } else {
          setSelected([item.value]);
          setExcluded((prev) => prev.filter((ele) => ele !== item.value));
        }
        break;
      default:
        console.error('Unknown type for FilterList');
        break;
    }
    onChange?.(selected, excluded);
  };

  const handleToggleExclude = (item: FilterListItem) => () => {
    switch (type) {
      case 'checkbox':
        const currentIndex = excluded.indexOf(item.value);
        const newExcluded = [...excluded];

        if (currentIndex === -1) {
          newExcluded.push(item.value);
        } else {
          newExcluded.splice(currentIndex, 1);
        }

        setSelected((prev) => prev.filter((ele) => ele !== item.value));
        setExcluded(newExcluded);
        break;
      case 'radio':
        if (allowDeselecting && excluded.includes(item.value)) {
          setExcluded([]);
        } else {
          setSelected((prev) => prev.filter((ele) => ele !== item.value));
          setExcluded([item.value]);
        }
        break;
      default:
        console.error('Unknown type for FilterList');
        break;
    }
    onChange?.(selected, excluded);
  };

  const options: FilterListItem[] = optionsProp?.map((option) => {
    if (typeof option === 'string') {
      return { value: option };
    } else {
      return option;
    }
  });

  return (
    <List className="flex flex-col gap-1 p-0">
      {options.map((option) => (
        <ListItem
          key={option.value}
          disablePadding
          className="group/li"
          secondaryAction={
            enableExclusion ? (
              <IconButton
                aria-label={`exclude ${option.label ?? option.value}`}
                className="group/secondary"
                size="small"
                onClick={handleToggleExclude(option)}
              >
                <BlockIcon
                  fontSize="small"
                  className={`transition-opacity ${(excludedValues ?? excluded).includes(option.value) ? 'text-rose-400 dark:text-rose-600' : 'text-neutral-400 dark:text-neutral-600 group-hover/secondary:text-neutral-600 dark:group-hover/secondary:text-neutral-400 invisible group-hover/li:visible'}`}
                />
              </IconButton>
            ) : undefined
          }
          slotProps={{ secondaryAction: { className: 'right-1' } }}
        >
          <ListItemButton
            role={undefined}
            onClick={handleToggle(option)}
            className={`p-0 rounded-lg transition-colors ${(selectedValues ?? selected).includes(option.value) ? 'bg-royal/10 dark:bg-cornflower-300/10' : ''}`}
          >
            {enableExclusion && (
              <div
                className={`absolute inset-0 rounded-lg bg-linear-to-l from-rose-300/20 dark:from-rose-800/20 to-transparent to-75% transition-opacity opacity-0 ${(excludedValues ?? excluded).includes(option.value) ? 'opacity-100' : ''}`}
              />
            )}
            <ListItemIcon className="min-w-8">
              {type === 'checkbox' ? (
                <Checkbox
                  checked={(selectedValues ?? selected).includes(option.value)}
                  disableRipple
                  tabIndex={-1}
                  size="small"
                  slotProps={{ root: { className: 'p-2' } }}
                  value={option.value}
                />
              ) : type === 'radio' ? (
                <Radio
                  checked={(selectedValues ?? selected).includes(option.value)}
                  disableRipple
                  disableTouchRipple
                  tabIndex={-1}
                  size="small"
                  slotProps={{ root: { className: 'p-2' } }}
                  value={option.value}
                />
              ) : undefined}
            </ListItemIcon>
            <ListItemText
              primary={option.label ?? option.value}
              slotProps={{ primary: { className: 'text-sm' } }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
