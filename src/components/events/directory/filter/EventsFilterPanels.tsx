'use client';

import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Panel, { PanelProps } from '@src/components/common/Panel';
import { ClubTagEdit } from '@src/components/manage/form/ClubTagEdit';
import { eventFiltersSchema } from '@src/utils/eventFilter';
import FilterList from './FilterList';

type EventsFilterPanelsProps = {
  backgroundHover?: boolean;
};

export default function EventsFilterPanels({
  backgroundHover = false,
}: EventsFilterPanelsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = (params: URLSearchParams) => {
    // Use one of the following

    // // Next.JS's router
    // router.replace(`${pathname}?${params.toString().replace(/=(?=&|$)/g, '')}`);

    // Client-side replacing URL
    window.history.replaceState(
      null,
      '',
      `${pathname}?${params.toString().replace(/=(?=&|$)/g, '')}`,
    );
  };

  const filters = eventFiltersSchema.parse(Object.fromEntries(searchParams));

  const panelProps: PanelProps = {
    smallPadding: true,
    enableCollapsing: { toggleOnHeadingClick: true },
    transparent: backgroundHover ? 'falseOnHover' : true,
  };

  // const [clubs, setClubs] =
  //   useState<z.infer<typeof eventClubsFilterEnum>>('all');
  const clubs = filters.clubs;
  const hideRegistered = filters.hideRegistered;
  const past = filters.past;

  const [tags, setTags] = useState<string[]>([]);

  const [date, setDate] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customDateEnd, setCustomDateEnd] = useState<Date | null>(null);
  const [location, setLocation] = useState<string[]>([]);
  const [locationExclude, setLocationExclude] = useState<string[]>([]);

  return (
    <div className="flex flex-col">
      <Panel heading="Filters" {...panelProps}>
        <ToggleButtonGroup
          value={clubs}
          exclusive
          onChange={(_e, newValue) => {
            if (newValue !== null) {
              // setClubs(newValue);
              const params = new URLSearchParams(searchParams);
              params.set('clubs', newValue);
              navigateWithParams(params);
            }
          }}
          size="small"
          className="[&>.MuiButtonBase-root]:normal-case [&>.MuiButtonBase-root]:grow"
          aria-label="Relevance"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="following">Your Clubs</ToggleButton>
          <ToggleButton value="new">Discover</ToggleButton>
        </ToggleButtonGroup>
        <FormControlLabel
          label="Hide registered events"
          control={
            <Switch
              checked={hideRegistered}
              onChange={(_e, newValue) => {
                const params = new URLSearchParams(searchParams);
                if (newValue) {
                  params.set('hideRegistered', '');
                } else {
                  params.delete('hideRegistered');
                }
                navigateWithParams(params);
              }}
            />
          }
        />
        <FormControlLabel
          label="Past events"
          control={
            <Switch
              checked={past}
              onChange={(_e, newValue) => {
                const params = new URLSearchParams(searchParams);
                if (newValue) {
                  params.set('past', '');
                } else {
                  params.delete('past');
                }
                navigateWithParams(params);
              }}
            />
          }
        />
      </Panel>
      <Divider variant="middle" />
      <Panel heading="Tags" {...panelProps}>
        <ClubTagEdit
          value={tags}
          onChange={(newValue) => {
            setTags(newValue);
          }}
          onBlur={() => {}}
        />
      </Panel>
      <Divider variant="middle" />
      <Panel heading="Date" {...panelProps}>
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
      <Divider variant="middle" />
      <Panel heading="Location" {...panelProps}>
        <FilterList
          options={['On-Campus', 'Off-Campus', 'Online', 'Hybrid']}
          type="checkbox"
          enableExclusion
          selectedValues={location}
          excludedValues={locationExclude}
          onChange={(newSelectedValues, newExcludedValues) => {
            setLocation(newSelectedValues);
            setLocationExclude(newExcludedValues);
          }}
        />
      </Panel>
    </div>
  );
}
