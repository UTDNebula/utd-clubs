'use client';

import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import EventsFilterPanels from './EventsFilterPanels';
import FilterChip from './FilterChip';

export default function EventsFilterBar() {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Chip
          label="Filters"
          icon={<TuneIcon fontSize="small" />}
          variant="outlined"
          onClick={() => setOpenModal(true)}
          className="border-[var(--mui-palette-divider)]"
        />
        <FilterChip label="Tag" />
        <FilterChip
          label="Popover"
          popoverComponent={<div className="mx-8 my-6">test</div>}
        />
        <FilterChip label="Info" disableDelete />
        <FilterChip
          label="idk"
          popoverComponent={<div className="mx-8 my-6">test</div>}
          disableDelete
        />
        {/* {[''].map((ele, index) => (
          <FilterChip label="test" key={index} />
        ))} */}
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        className="flex justify-center w-screen h-screen p-4"
        // keepMounted // Used to keep the collapsed state of sections in the modal persistent
      >
        {/* This span is required to receive the tabIndex prop, which will let the user quickly navigate the modal using the keyboard */}
        <span className="w-120 h-fit">
          <Panel
            smallPadding
            className="h-fit max-h-screen w-fill p-0!"
            slotClassNames={{ collapse: 'relative' }}
          >
            <div className="relative overflow-auto max-h-[calc(100dvh-6rem)] px-5 pt-5">
              <EventsFilterPanels />
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
