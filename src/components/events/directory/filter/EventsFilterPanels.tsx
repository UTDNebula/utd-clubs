'use client';

import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import Panel, { PanelProps } from '@src/components/common/Panel';
import { ClubTagEdit } from '@src/components/manage/form/ClubTagEdit';
import FilterList from './FilterList';

type EventsFilterPanelsProps = {
  backgroundHover?: boolean;
};

export default function EventsFilterPanels({
  backgroundHover = false,
}: EventsFilterPanelsProps) {
  const panelProps: PanelProps = {
    smallPadding: true,
    enableCollapsing: { toggleOnHeadingClick: true },
    transparent: backgroundHover ? 'falseOnHover' : true,
  };
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
          size="small"
          className="[&>.MuiButtonBase-root]:normal-case [&>.MuiButtonBase-root]:grow"
          exclusive
          aria-label="Relevance"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="following">Your Clubs</ToggleButton>
          <ToggleButton value="discover">Discover</ToggleButton>
        </ToggleButtonGroup>
        <FormControlLabel label="Hide registered events" control={<Switch />} />
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
