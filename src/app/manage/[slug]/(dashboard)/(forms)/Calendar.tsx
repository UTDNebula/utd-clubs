'use client';

import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

type CalendarProps = {
  club: SelectClub;
  hasScopes: boolean;
};

const Calendar = ({ club, hasScopes }: CalendarProps) => {
  const isSyncing = !!club.calendarId && !!club.calendarName;
  const trpc = useTRPC();
  const { data, isSuccess } = useQuery(
    trpc.event.getUserCalendars.queryOptions(),
  );
  const [selectedCalendar, setSelectedCalendar] = useState<{
    id: string;
    summary: string;
  }>(
    isSyncing
      ? { id: club.calendarId!, summary: club.calendarName! }
      : { id: '', summary: '' },
  );
  const pathname = usePathname();
  const router = useRouter();
  const syncEvents = useMutation(trpc.club.eventSync.mutationOptions());
  const disableSync = useMutation(trpc.event.disableSync.mutationOptions());

  return (
    <Panel heading="Google Calendar Sync">
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
        {!hasScopes ? (
          <Button
            variant="contained"
            className="normal-case w-full"
            startIcon={<GoogleIcon />}
            onClick={() => {
              void authClient.linkSocial({
                provider: 'google',
                scopes: [
                  'https://www.googleapis.com/auth/calendar.events.public.readonly',
                  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
                ],
                callbackURL: pathname,
              });
            }}
          >
            Authorize Google Calendar Access
          </Button>
        ) : isSyncing ? (
          <>
            <Alert severity="success">
              Google Calendar sync is active from <b>{club.calendarName}</b>.
            </Alert>
            <div className="flex flex-wrap gap-4">
              <FormControl className="grow" size="small">
                <InputLabel id="calendar-select-label">
                  Linked Calendar
                </InputLabel>
                <Select
                  labelId="calendar-select-label"
                  value={selectedCalendar.id}
                  label="Linked Calendar"
                >
                  {isSuccess &&
                    data.map((calendar) => (
                      <MenuItem key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="normal-case"
                onClick={async () => {
                  await disableSync.mutateAsync({
                    clubId: club.id,
                  });
                  router.refresh();
                }}
              >
                Disable Sync
              </Button>
              <Button
                variant="contained"
                className="normal-case"
                disabled={selectedCalendar.id == ''}
                onClick={async () => {
                  await syncEvents.mutateAsync({
                    calendarId: selectedCalendar.id,
                    calendarName: selectedCalendar.summary,
                    clubId: club.id,
                  });
                  router.refresh();
                }}
              >
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
                  label="Link Calendar"
                  value={selectedCalendar.id}
                  onChange={(e) => {
                    if (isSuccess) {
                      const calendar = data.find((c) => c.id == e.target.value);
                      if (calendar) {
                        setSelectedCalendar(calendar);
                      }
                    }
                  }}
                >
                  {isSuccess &&
                    data.map((calendar) => (
                      <MenuItem key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="normal-case"
                startIcon={<GoogleIcon />}
                disabled={selectedCalendar.id == ''}
                onClick={async () => {
                  await syncEvents.mutateAsync({
                    calendarId: selectedCalendar.id,
                    calendarName: selectedCalendar.summary,
                    clubId: club.id,
                  });
                  router.refresh();
                }}
              >
                Enable Google Calendar Sync
              </Button>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
};

export default Calendar;
