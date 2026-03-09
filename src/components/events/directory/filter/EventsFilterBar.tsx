'use client';

import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import {
  EventFiltersSchema,
  SelectedEventFiltersList,
  splitArrayField,
} from '@src/utils/eventFilter';
import EventsFilterPanels from './EventsFilterPanels';
import FilterChip from './FilterChip';

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
          {selectedFilters?.map((filter) => (
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
              <FilterChip label={filter.field} />
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
