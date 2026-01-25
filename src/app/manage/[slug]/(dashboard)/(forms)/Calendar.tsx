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
import { useEffect, useState } from 'react';
import Panel from '@src/components/common/Panel';
import Confirmation from '@src/components/Confirmation';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

type CalendarProps = {
  club: SelectClub;
  hasScopes: boolean;
  userEmail: string;
};

const Calendar = ({ club, hasScopes, userEmail }: CalendarProps) => {
  const isSyncing = !!club.calendarId && !!club.calendarName;
  const trpc = useTRPC();
  const { data, isSuccess } = useQuery(
    trpc.event.getUserCalendars.queryOptions(),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  const syncEvents = useMutation(
    trpc.club.eventSync.mutationOptions({
      onError: (err) => {
        setIsRefreshing(false);
        if (err.data?.code === 'NOT_FOUND') {
          setPrivateCalendarOpen(true);
        }
      },
    }),
  );
  const disableSync = useMutation(trpc.event.disableSync.mutationOptions());
  const [privateCalendarOpen, setPrivateCalendarOpen] = useState(false);
  const [disableSyncConfirmationOpen, setDisableSyncConfirmationOpen] =
    useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDisableSyncConfirmationOpen(false);
      setIsRefreshing(false);
    }, 0);
    return () => clearTimeout(t);
  }, [isSyncing]);

  return (
    <Panel
      heading="Google Calendar Sync"
      description={
        <>
          <p>
            If your organization uses a shared Google Calendar we can pull its
            events into UTD Clubs.
          </p>
          <p>
            The sync will be active as long as you are a collaborator on this
            organization.
          </p>
        </>
      }
    >
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
                onClick={() => setDisableSyncConfirmationOpen(true)}
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
            <Confirmation
              open={disableSyncConfirmationOpen}
              onClose={() => setDisableSyncConfirmationOpen(false)}
              contentText={
                <>
                  Disabling will delete all events synced from{' '}
                  <b>{selectedCalendar.summary}</b>.
                </>
              }
              confirmText="Disable Sync"
              confirmColor="primary"
              onConfirm={async () => {
                await disableSync.mutateAsync({
                  clubId: club.id,
                });
                router.refresh();
              }}
              loading={disableSync.isPending}
            />
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
                disabled={selectedCalendar.id == '' || isRefreshing}
                onClick={async () => {
                  setIsRefreshing(true);
                  await syncEvents.mutateAsync({
                    calendarId: selectedCalendar.id,
                    calendarName: selectedCalendar.summary,
                    clubId: club.id,
                  });
                  router.refresh();
                }}
              >
                {isRefreshing ? 'Connecting...' : 'Enable Google Calendar Sync'}
              </Button>
            </div>
          </>
        )}
      </div>
      <Confirmation
        open={privateCalendarOpen}
        onClose={() => setPrivateCalendarOpen(false)}
        title={'Calendar sync failed'}
        contentText={
          <>
            <b>{selectedCalendar.summary}</b> is a private calendar. To allow
            syncing, enable <b>&quot;Make available to public&quot;</b> & set
            the dropdown to <b>&quot;See all event details&quot;</b> in your
            calendar&apos;s settings.
          </>
        }
        confirmText="Edit Calendar Settings"
        confirmColor="primary"
        onConfirm={async () => {
          window.open(
            `https://calendar.google.com/calendar/r/settings/calendar/${btoa(selectedCalendar.id)}?authuser=${userEmail}#:~:text=Make%20available%20to%20public`,
            '_blank',
            'noopener,noreferrer',
          );
          setPrivateCalendarOpen(false);
          router.refresh();
        }}
      />
    </Panel>
  );
};

export default Calendar;
