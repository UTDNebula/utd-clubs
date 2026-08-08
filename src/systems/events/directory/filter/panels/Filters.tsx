import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { memo } from 'react';
import Panel from '@nebula-library/components/Panel';
import { authClient } from '@/common/modules/auth/auth-client';
import { EventFiltersSchema } from '@/systems/events/eventFilter';
import { openLoginModal } from '@/common/modules/loginModal';
import { closeSnackbar, setSnackbar } from '@/common/modules/snackbar';
import { FilterPanelProps, panelProps, setEventsParams } from '../utils';

const eventsFiltersSnackbarId = 'eventsFilters';

export type FiltersPanelFields = Pick<
  EventFiltersSchema,
  'clubs' | 'hideRegistered' | 'past'
>;

export default memo(function FiltersPanel(
  props: FilterPanelProps<FiltersPanelFields>,
) {
  const session = authClient.useSession();
  const signedIn = Boolean(session.data);

  function showSignInMessage() {
    setSnackbar({
      id: eventsFiltersSnackbarId,
      message: "This filter option only works when you're signed in",
      autoHideDuration: true,
      fitContent: true,
      closeOn: {
        clickaway: false,
        dismiss: true,
        escapeKeyDown: true,
        timeout: true,
      },
      action: (
        <Button
          size="small"
          onClick={() => {
            openLoginModal();
          }}
          color="inherit"
        >
          Sign in
        </Button>
      ),
    });
  }

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
            if (!signedIn) {
              if (newValue !== 'all') {
                showSignInMessage();
              } else {
                closeSnackbar(eventsFiltersSnackbarId);
              }
            }
            setEventsParams((params) => {
              if (newValue !== 'all') {
                params.set('clubs', newValue);
              } else {
                params.delete('clubs');
              }
            });
          }
        }}
        size="small"
        className="[&>.MuiButtonBase-root]:grow [&>.MuiButtonBase-root]:normal-case"
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
              if (!signedIn) {
                if (newValue) {
                  showSignInMessage();
                } else {
                  closeSnackbar(eventsFiltersSnackbarId);
                }
              }
              setEventsParams((params) => {
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
              setEventsParams((params) => {
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
