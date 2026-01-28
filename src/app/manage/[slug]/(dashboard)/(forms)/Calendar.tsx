'use client';

import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Button,
  Checkbox,
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
  const { data, isSuccess, isLoading } = useQuery(
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
      onSuccess: (result) => {
        setIsRefreshing(false);
        // Check for the partial success flag
        if (
          result &&
          typeof result === 'object' &&
          'status' in result &&
          result.status === 'ONE_TIME_SYNC'
        ) {
          setOnetimeSyncOpen(true);
        }
        router.refresh();
      },
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
  const [onetimeSyncOpen, setOnetimeSyncOpen] = useState(false);
  const [disableSyncConfirmationOpen, setDisableSyncConfirmationOpen] =
    useState(false);
  const [keepPastEventsOnDeletion, setKeepPastEventsOnDeletion] =
    useState(true);

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
        {!hasScopes || !isSuccess ? ( // if refresh_token doesn't have GCal perms, getUserCalendars will fail
          <Button
            variant="contained"
            className="normal-case w-full"
            startIcon={<GoogleIcon />}
            disabled={isLoading}
            loading={isLoading}
            loadingPosition="center"
            onClick={() => {
              void authClient.linkSocial({
                provider: 'google',
                scopes: [
                  'https://www.googleapis.com/auth/calendar.events.public.readonly',
                  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
                ],
                callbackURL: pathname,
                fetchOptions: {
                  onResponse: (context) => {
                    const url = context.response.headers.get('Location');
                    if (url) {
                      const newUrl = new URL(url);
                      newUrl.searchParams.set('prompt', 'consent');
                      newUrl.searchParams.set('access_type', 'offline');
                      window.location.href = newUrl.toString();
                    }
                  },
                },
              });
            }}
          >
            Authorize Google Calendar Access
          </Button>
        ) : data.length > 0 ? (
          isSyncing ? (
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
                    className="bg-gray-100 dark:bg-gray-900"
                    disabled
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
                  onClick={() => {
                    setDisableSyncConfirmationOpen(true);
                    setKeepPastEventsOnDeletion(true);
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
              <Confirmation
                open={disableSyncConfirmationOpen}
                onClose={() => setDisableSyncConfirmationOpen(false)}
                contentText={
                  <div>
                    <p>
                      Disabling will delete all events synced from{' '}
                      <b>{selectedCalendar.summary}</b>.
                    </p>
                    <div className="flex flex-row items-center">
                      <Checkbox
                        checked={keepPastEventsOnDeletion}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => setKeepPastEventsOnDeletion(event.target.checked)}
                      />
                      <p className="text-persimmon-500">
                        Keep events that have already passed?
                      </p>
                    </div>
                  </div>
                }
                confirmText="Disable Sync"
                confirmColor="error"
                onConfirm={async () => {
                  await disableSync.mutateAsync({
                    clubId: club.id,
                    keepPastEvents: keepPastEventsOnDeletion,
                  });
                  router.refresh();
                }}
                loading={disableSync.isPending}
              />
            </>
          ) : (
            <>
              <Alert severity="error">
                Google Calendar sync is not active.
              </Alert>
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
                        const calendar = data.find(
                          (c) => c.id == e.target.value,
                        );
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
                  loading={isRefreshing}
                  loadingPosition="start"
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
                  Enable Google Calendar Sync
                </Button>
              </div>
            </>
          )
        ) : (
          <>
            <Alert severity="error">Account has no calendars</Alert>
            <div className="flex flex-wrap gap-4">
              <FormControl className="grow" size="small">
                <InputLabel id="calendar-select-label">
                  Link Calendar
                </InputLabel>
                <Select
                  labelId="calendar-select-label"
                  label="Link Calendars"
                  value={'no-calendar-found'}
                  disabled
                >
                  <MenuItem value="no-calendar-found">
                    No Calendar Found
                  </MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="normal-case"
                startIcon={<GoogleIcon />}
                onClick={async () => {
                  window.open(
                    `https://calendar.google.com/calendar/r/?authuser=${userEmail}`,
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
              >
                Visit Google Calendar
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
      <Confirmation
        open={onetimeSyncOpen}
        onClose={() => setOnetimeSyncOpen(false)}
        title={'Cannot Live-Sync Calendar'}
        contentText={
          <>
            <b>{selectedCalendar.summary}</b> does not allow live syncing of
            events, so we imported all the events <i>currently</i> in the
            calendar. If you make any changes, you will have to re-sync.
          </>
        }
        confirmText="Import events once"
        confirmColor="primary"
        onConfirm={async () => {
          setOnetimeSyncOpen(false);
          router.refresh();
        }}
      />
    </Panel>
  );
};

export default Calendar;
