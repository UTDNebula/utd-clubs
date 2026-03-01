import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { memo, useState } from 'react';
import Panel from '@src/components/common/Panel';
import FilterList from '../FilterList';
import { FilterPanelBaseProps, panelProps } from '../utils';

export default memo(function DatePanel(props: FilterPanelBaseProps) {
  const [date, setDate] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customDateEnd, setCustomDateEnd] = useState<Date | null>(null);

  return (
    <Panel heading="Date" {...panelProps(props.backgroundHover)}>
      <FilterList
        options={[
          'Today',
          'Tomorrow',
          'This weekend',
          'This week',
          'This month',
          {
            label: 'Custom date...',
            value: 'custom',
            disableExclusion: true,
            secondaryAction: {
              visible: Boolean(customDate || customDateEnd),
              onClick: () => {
                setCustomDate(null);
                setCustomDateEnd(null);
              },
              icon: (
                <ClearIcon
                  fontSize="small"
                  className="text-neutral-600 dark:text-neutral-400"
                />
              ),
              tooltip: 'Clear',
            },
          },
        ]}
        type="radio"
        selectedValues={date ? [date] : []}
        onChange={(newSelectedValues) => {
          setDate(newSelectedValues[0] ?? null);
        }}
      />
      {date?.includes('custom') && (
        <div className="flex flex-col gap-4 pt-2 sm:pl-8">
          <DatePicker
            label="Date"
            value={customDate}
            onChange={(value) => {
              if (value) {
                setCustomDateEnd(
                  !customDate && customDateEnd
                    ? // Do not change end date if start isn't present and end date exists
                      customDateEnd
                    : // Set end date to new start date plus difference between current start and end dates
                      new Date(
                        value?.getTime() +
                          (customDate && customDateEnd
                            ? customDateEnd.getTime() - customDate.getTime()
                            : 0),
                      ),
                );
              }
              setCustomDate(value);
            }}
            slotProps={{
              textField: {
                size: 'small',
                className: '[&_.MuiPickersSectionList-root]:w-0',
              },
              actionBar: {
                actions: ['today', 'accept'],
              },
            }}
          />
          <DatePicker
            label="End date"
            value={customDateEnd}
            onChange={(value) => setCustomDateEnd(value)}
            minDate={customDate ?? undefined}
            slotProps={{
              textField: {
                size: 'small',
                className: '[&_.MuiPickersSectionList-root]:w-0',
              },
              actionBar: {
                actions: ['today', 'accept'],
              },
            }}
          />
        </div>
      )}
    </Panel>
  );
});
