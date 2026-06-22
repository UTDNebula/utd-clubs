import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { memo } from 'react';
import { closeSnackbar, setSnackbar } from 'src/utils/snackbar';
import Panel from '@src/components/common/Panel';
import { useRegisterModal } from '@src/components/global/RegisterModalProvider';
import { authClient } from '@src/utils/auth-client';
import { EventFiltersSchema } from '@src/utils/eventFilter';
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

  const { setShowRegisterModal } = useRegisterModal();

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
            setShowRegisterModal(true);
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
