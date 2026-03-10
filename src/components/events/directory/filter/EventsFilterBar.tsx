'use client';

import TagIcon from '@mui/icons-material/Tag';
import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import Panel from '@src/components/common/Panel';
import { TagChip } from '@src/components/common/TagChip';
import {
  EventFiltersSchema,
  eventLocationFilterEnum,
  eventLocationStrings,
  filterFieldToParam,
  SelectedEventFiltersList,
  splitArrayField,
  temporalDeixisStrings,
} from '@src/utils/eventFilter';
import EventsFilterPanels from './EventsFilterPanels';
import FilterChip from './FilterChip';
import { setParams } from './utils';

const hiddenFields: (keyof EventFiltersSchema)[] = [
  'dateStart',
  'dateEnd',
  'query',
  'sort',
  'page',
  'size',
];

type EventsFilterBarProps = {
  filters: EventFiltersSchema;
  selectedFilters?: SelectedEventFiltersList;
};

export default function EventsFilterBar({
  filters,
  selectedFilters,
}: EventsFilterBarProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleDeleteTag = (filter: SelectedEventFiltersList[number]) => {
    setParams((params) => {
      const newValue = params
        .get('tags')
        ?.split(',')
        .filter((ele) => ele !== filter.value)
        .join(',');

      if (newValue === '') {
        params.delete('tags');
      } else if (newValue) {
        params.set('tags', newValue);
      }
    });
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Chip
          label="Filters"
          icon={<TuneIcon fontSize="small" />}
          variant="outlined"
          onClick={() => setOpenModal(true)}
          className="border-[var(--mui-palette-divider)]"
        />
        <AnimatePresence>
          {selectedFilters
            ?.filter((ele) => !hiddenFields.includes(ele.field))
            .map((filter) => (
              <motion.div
                key={
                  splitArrayField(filter.field)
                    ? `${filter.field}-${filter.value}`
                    : `${filter.field}`
                }
                layout
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.1 }}
              >
                {filter.field === 'tags' ? (
                  <TagChip
                    icon={<TagIcon color="inherit" />}
                    tag={filter.value}
                    onClick={() => handleDeleteTag(filter)}
                    onDelete={() => handleDeleteTag(filter)}
                  />
                ) : (
                  <FilterChip
                    label={getChipLabel(filter, selectedFilters)}
                    onDelete={() => {
                      setParams((params) => {
                        if (splitArrayField(filter.field)) {
                          // If field is an array but filter is a single item, handle accordingly
                          const newValue = params
                            .get(filterFieldToParam[filter.field])
                            ?.split(',')
                            .filter((ele) => ele !== filter.value)
                            .join(',');

                          if (newValue === '') {
                            params.delete(filterFieldToParam[filter.field]);
                          } else if (newValue) {
                            params.set(
                              filterFieldToParam[filter.field],
                              newValue,
                            );
                          }
                        } else {
                          // Otherwise, handle normally
                          params.delete(filterFieldToParam[filter.field]);

                          // Special case: Delete dateStart and dateEnd if custom date is removed
                          if (
                            filter.field === 'date' &&
                            filter.value === 'custom'
                          ) {
                            params.delete('dateStart');
                            params.delete('dateEnd');
                          }
                        }
                      });
                    }}
                  />
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        className="flex justify-center w-screen h-screen p-4"
      >
        {/* This span is required to receive the tabIndex prop, which will let the user quickly navigate the modal using the keyboard */}
        <span className="w-120 h-fit">
          <Panel
            smallPadding
            className="h-fit max-h-screen w-fill p-0!"
            slotClassNames={{ collapse: 'relative' }}
          >
            <div className="relative overflow-auto max-h-[calc(100dvh-6rem)] px-5 pt-5">
              <EventsFilterPanels filters={filters} />
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2 px-5 pb-5">
              <Button
                onClick={() => {
                  // TODO: Insert function to clear all filters
                  handleClose();
                }}
                color="warning"
                className="normal-case"
              >
                Clear all
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                className="normal-case"
              >
                OK
              </Button>
            </div>
          </Panel>
        </span>
      </Modal>
    </>
  );
}

function getChipLabel(
  filter: SelectedEventFiltersList[number],
  allFilters?: SelectedEventFiltersList,
): ReactNode {
  switch (filter.field) {
    case 'clubs':
      switch (filter.value) {
        case 'all':
          return 'All';
        case 'following':
          return 'Your Clubs';
        case 'new':
          return 'Discover';
        default:
          return '';
      }
    case 'hideRegistered':
      return 'Hide registered events';
    case 'past':
      return 'Past events';
    case 'tags':
      return `${filter.value}`;
    case 'date':
      const dateStart = allFilters?.find((ele) => ele.field === 'dateStart');
      const dateEnd = allFilters?.find((ele) => ele.field === 'dateEnd');
      if (filter.value === 'custom' && (dateStart || dateEnd)) {
        return `${dateStart?.value?.toLocaleDateString()} - ${dateEnd?.value?.toLocaleDateString()}`;
      } else {
        return `${filter.value ? temporalDeixisStrings[filter.value] : ''}`;
      }
    case 'location':
      if (Array.isArray(filter.value)) {
        return `${filter.value.map((ele: (typeof eventLocationFilterEnum.options)[number]) => eventLocationStrings[ele]).join(', ')}`;
      } else {
        return eventLocationStrings[filter.value];
      }
    case 'locationExclude':
      if (Array.isArray(filter.value)) {
        return `Exclude: ${filter.value.map((ele: (typeof eventLocationFilterEnum.options)[number]) => eventLocationStrings[ele]).join(', ')}`;
      } else {
        return `Exclude: ${eventLocationStrings[filter.value]}`;
      }
    default:
      return `${filter.field}: ${filter.value}`;
  }
}
