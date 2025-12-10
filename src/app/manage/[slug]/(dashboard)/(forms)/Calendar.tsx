'use client';

import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import FormFieldSet from '@src/components/form/FormFieldSet';
import type { SelectClub } from '@src/server/db/models';

type CalendarProps = {
  club: SelectClub;
};

const Calendar = ({ club }: CalendarProps) => {
  const isLinked = false;
  const isSyncing = false;
  const syncingFrom = 'Org Calendar';
  const allCalendars = [
    syncingFrom,
    'My Calendar',
    "Your Mom's Calendar",
    'Some other BS',
  ];

  return (
    <FormFieldSet legend="Google Calendar Sync">
      <div className="ml-2 mb-2 text-slate-600 text-sm">
        <p>
          If your organization uses a shared Google Calendar we can pull its
          events into UTD Clubs.
        </p>
        <p>
          The sync will be active as long as you are a collaborator on this
          organization.
        </p>
      </div>
      <div className="m-2 flex flex-col gap-4">
        {!isLinked ? (
          <Tooltip title="Coming Soon">
            <span>
              <Button
                variant="contained"
                className="normal-case w-full"
                startIcon={<GoogleIcon />}
                disabled
              >
                Link Google Calendar
              </Button>
            </span>
          </Tooltip>
        ) : isSyncing ? (
          <>
            <Alert severity="success">
              Google Calendar sync is active from <b>{syncingFrom}</b>.
            </Alert>
            <div className="flex flex-wrap gap-4">
              <FormControl className="grow" size="small">
                <InputLabel id="calendar-select-label">
                  Linked Calendar
                </InputLabel>
                <Select
                  labelId="calendar-select-label"
                  value={syncingFrom}
                  label="Linked Calendar"
                >
                  {allCalendars.map((calendar) => (
                    <MenuItem key={calendar} value={calendar}>
                      {calendar}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" className="normal-case">
                Disable Sync
              </Button>
              <Button variant="contained" className="normal-case">
                Resync
              </Button>
            </div>
          </>
        ) : (
          <>
            <Alert severity="error">Google Calendar sync is not active.</Alert>
            <div className="flex flex-wrap gap-4">
              <FormControl className="grow" size="small">
                <InputLabel id="calendar-select-label">
                  Link Calendar
                </InputLabel>
                <Select
                  labelId="calendar-select-label"
                  value={syncingFrom}
                  label="Link Calendar"
                >
                  {allCalendars.map((calendar) => (
                    <MenuItem key={calendar} value={calendar}>
                      {calendar}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="normal-case"
                startIcon={<GoogleIcon />}
              >
                Enable Google Calendar Sync
              </Button>
            </div>
          </>
        )}
      </div>
    </FormFieldSet>
  );
};

export default Calendar;
