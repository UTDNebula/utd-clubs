'use client';

import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import EventsFilterPanels from './EventsFilterPanels';

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
          icon={<TuneIcon />}
          variant="outlined"
          onClick={() => setOpenModal(true)}
          className="border-[var(--mui-palette-divider)]"
        />
        <Chip label="Tags" onDelete={() => {}} />
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        className="flex justify-center items-center h-screen p-4"
        keepMounted // Used to keep the collapsed state of sections in the modal persistent
      >
        {/* This span is required to receive the tabIndex prop, which will let the user quickly navigate the modal using the keyboard */}
        <span>
          <Panel
            smallPadding
            className="h-fit max-h-screen"
            slotClassNames={{ collapse: 'relative' }}
          >
            <div className="relative overflow-auto max-h-[calc(100vh-8rem)]">
              <EventsFilterPanels />
            </div>
            <div className="flex flex-wrap justify-end items-center gap-2">
              <Button variant="contained" onClick={handleClose}>
                OK
              </Button>
            </div>
          </Panel>
        </span>
      </Modal>
    </>
  );
}
