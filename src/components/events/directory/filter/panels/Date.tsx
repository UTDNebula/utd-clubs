import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { memo, useState } from 'react';
import z from 'zod';
import Panel from '@src/components/common/Panel';
import {
  EventFiltersSchema,
  temporalDeixisCustomDateSentinelValue,
  temporalDeixisWithCustomFilterEnum,
} from '@src/utils/eventFilter';
import FilterList, { FilterListItem } from '../FilterList';
import { FilterPanelProps, panelProps, setParams } from '../utils';

export type DatePanelFields = Pick<
  EventFiltersSchema,
  'date' | 'dateStart' | 'dateEnd'
>;

export default memo(function DatePanel(
  props: FilterPanelProps<DatePanelFields>,
) {
  const date = props.filters.date;

  const [customDate, setCustomDate] = useState<Date | null>(
    props.filters.dateStart,
  );
  const [customDateEnd, setCustomDateEnd] = useState<Date | null>(
    props.filters.dateEnd,
  );

  return (
    <Panel heading="Date" {...panelProps(props.backgroundHover)}>
      <FilterList
        options={
          [
            { label: 'Today', value: 'today' },
            { label: 'Tomorrow', value: 'tomorrow' },
            { label: 'This weekend', value: 'this weekend' },
            { label: 'This week', value: 'this week' },
            { label: 'This month', value: 'this month' },
            {
              label: 'Custom date...',
              value: temporalDeixisCustomDateSentinelValue,
              disableExclusion: true,
              secondaryAction: {
                visible: Boolean(customDate || customDateEnd),
                onClick: () => {
                  setCustomDate(null);
                  setCustomDateEnd(null);

                  setParams((params) => {
                    params.set('date', temporalDeixisCustomDateSentinelValue);
                    params.delete('dateStart');
                    params.delete('dateEnd');
                  });
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
          ] satisfies FilterListItem<
            z.infer<typeof temporalDeixisWithCustomFilterEnum>
          >[]
        }
        type="radio"
        selectedValues={date ? [date] : []}
        onChange={(newSelectedValues) => {
          const newValue = newSelectedValues[0];

          setParams((params) => {
            if (newValue) {
              params.set('date', newValue);
              params.delete('dateStart');
              params.delete('dateEnd');

              // Set param's custom dateStart and dateEnd if their state has a value
              if (newValue === temporalDeixisCustomDateSentinelValue) {
                if (customDate) {
                  params.delete('date');
                  params.set(
                    'dateStart',
                    customDate.toISOString().split('T')[0]!,
                  );
                }
                if (customDateEnd) {
                  params.delete('date');
                  params.set(
                    'dateEnd',
                    customDateEnd.toISOString().split('T')[0]!,
                  );
                }
              }
            } else {
              params.delete('date');
            }
          });
        }}
      />
      {date?.includes(temporalDeixisCustomDateSentinelValue) && (
        <div className="flex flex-col gap-4 pt-2 sm:pl-8">
          <DatePicker
            label="Date"
            value={customDate}
            onChange={(value) => {
              if (value) {
                const newDateEnd = new Date(
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
                setCustomDate(value);
                setCustomDateEnd(newDateEnd);

                setParams((params) => {
                  if (value) {
                    params.set('dateStart', value.toISOString().split('T')[0]!);
                    params.set(
                      'dateEnd',
                      newDateEnd.toISOString().split('T')[0]!,
                    );
                    params.delete('date');
                  } else {
                    params.delete('dateStart');
                    params.delete('dateEnd');
                  }
                });
              }
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
            onChange={(value) => {
              setCustomDateEnd(value);

              setParams((params) => {
                if (value) {
                  params.set('dateEnd', value.toISOString().split('T')[0]!);
                  params.delete('date');
                } else {
                  params.delete('dateEnd');
                }
              });
            }}
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
