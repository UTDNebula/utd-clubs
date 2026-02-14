'use client';

import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Panel, { PanelProps } from '@src/components/common/Panel';

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
        Tag Selector
      </Panel>
      <Divider variant="middle" />
      <Panel heading="When" {...panelProps}>
        Date Selector
      </Panel>
    </div>
  );
}
