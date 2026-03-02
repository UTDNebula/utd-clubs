import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { memo } from 'react';
import Panel from '@src/components/common/Panel';
import { EventFiltersSchema } from '@src/utils/eventFilter';
import { FilterPanelProps, panelProps, setParams } from '../utils';

export type FiltersPanelFields = Pick<
  EventFiltersSchema,
  'clubs' | 'hideRegistered' | 'past'
>;

export default memo(function FiltersPanel(
  props: FilterPanelProps<FiltersPanelFields>,
) {
  const clubs = props.filters.clubs;
  const hideRegistered = props.filters.hideRegistered;
  const past = props.filters.past;

  return (
    <Panel heading="Filters" {...panelProps(props.backgroundHover)}>
      <ToggleButtonGroup
        value={clubs}
        exclusive
        onChange={(_e, newValue) => {
          if (newValue !== null) {
            setParams((params) => {
              if (newValue !== 'all') {
                params.set('clubs', newValue);
              } else {
                params.delete('clubs');
              }
            });
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
              setParams((params) => {
                if (newValue) {
                  params.set('hideRegistered', '');
                } else {
                  params.delete('hideRegistered');
                }
              });
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
              setParams((params) => {
                if (newValue) {
                  params.set('past', '');
                } else {
                  params.delete('past');
                }
              });
            }}
          />
        }
      />
    </Panel>
  );
});
