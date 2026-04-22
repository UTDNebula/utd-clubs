'use client';

import { Dialog, Popover, useMediaQuery } from '@mui/material';
import {
  Day,
  Inject,
  Month,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
} from '@syncfusion/ej2-react-schedule';
import {
  type ActionEventArgs,
  type EventClickArgs,
  type PopupOpenEventArgs,
} from '@syncfusion/ej2-schedule';
import { useQuery } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import EventCard from '@src/components/events/EventCard';
import { useTRPC } from '@src/trpc/react';
import { type RouterOutputs } from '@src/trpc/shared';
import {
  getBufferedRangeForWeek,
  getRangeForView,
  type CalendarRange,
} from '@src/utils/calendarRange';

type RegisteredEvent =
  RouterOutputs['userMetadata']['getRegisteredEventsByRange'][number];

const SCHEDULE_FIELDS = {
  id: 'Id',
  subject: { name: 'Subject' },
  startTime: { name: 'StartTime' },
  endTime: { name: 'EndTime' },
  location: { name: 'Location' },
  description: { name: 'Description' },
} as const;

const EventCalendar = () => {
  const scheduleRef = useRef<ScheduleComponent | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialDate = useMemo(() => startOfDay(new Date()), []);
  const isDesktop = useMediaQuery('(min-width:1024px)');

  const [selectedEvent, setSelectedEvent] = useState<RegisteredEvent | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoverAnchorEl, setHoverAnchorEl] = useState<Element | null>(null);
  const [hoverEvent, setHoverEvent] = useState<RegisteredEvent | null>(null);
  const [range, setRange] = useState<CalendarRange>(() =>
    getBufferedRangeForWeek(initialDate),
  );

  const trpc = useTRPC();
  const router = useRouter();

  const { data: events = [], isFetching } = useQuery(
    trpc.userMetadata.getRegisteredEventsByRange.queryOptions(range, {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }),
  );

  const eventMap = useMemo(
    () => new Map(events.map((e) => [e.id, e])),
    [events],
  );

  const schedulerData = useMemo(
    () =>
      events.map((event) => ({
        Id: event.id,
        Subject: event.name,
        StartTime: new Date(event.startTime),
        EndTime: new Date(event.endTime),
        Location: event.location ?? '',
        Description: event.description ?? '',
      })),
    [events],
  );

  const handleEventClick = (args: EventClickArgs) => {
    args.cancel = true;
    const raw = Array.isArray(args.event) ? args.event[0] : args.event;
    const eventId = typeof raw?.['Id'] === 'string' ? raw['Id'] : null;
    if (!eventId) return;
    const event = eventMap.get(eventId);
    if (!event) return;

    if (isDesktop) {
      router.push(`/events/${event.id}`);
    } else {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    }
  };

  const handlePopupOpen = (args: PopupOpenEventArgs) => {
    if (args.type === 'Editor' || args.type === 'QuickInfo') {
      args.cancel = true;
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleActionComplete = (args: ActionEventArgs) => {
    if (
      args.requestType !== 'dateNavigate' &&
      args.requestType !== 'viewNavigate'
    ) {
      return;
    }
    const view = scheduleRef.current?.currentView ?? 'Week';
    const anchor = scheduleRef.current?.selectedDate ?? initialDate;
    setRange(getRangeForView(view, new Date(anchor)));
  };

  const clearHover = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverAnchorEl(null);
      setHoverEvent(null);
    }, 150);
  };

  const getAppointmentElement = (target: EventTarget): Element | null =>
    (target as HTMLElement).closest('.e-appointment[data-id]');

  const resolveHoverEvent = (el: Element): RegisteredEvent | null => {
    try {
      const data = scheduleRef.current?.getEventDetails(el as HTMLElement);
      const id = typeof data?.['Id'] === 'string' ? data['Id'] : null;
      return id ? (eventMap.get(id) ?? null) : null;
    } catch {
      return null;
    }
  };

  const handleScheduleMouseOver = (e: React.MouseEvent) => {
    const appointmentEl = getAppointmentElement(e.target);

    if (!appointmentEl) {
      clearHover();
      return;
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (hoverAnchorEl === appointmentEl) return;

    const event = resolveHoverEvent(appointmentEl);
    if (event) {
      setHoverEvent(event);
      setHoverAnchorEl(appointmentEl);
    }
  };

  const showEmpty = !isFetching && events.length === 0;

  const schedule = (
    <ScheduleComponent
      ref={(el: ScheduleComponent | null) => {
        scheduleRef.current = el;
      }}
      height="100%"
      selectedDate={initialDate}
      currentView={isDesktop ? 'Week' : 'Day'}
      readonly={true}
      popupOpen={handlePopupOpen}
      actionComplete={handleActionComplete}
      eventSettings={{ dataSource: schedulerData, fields: SCHEDULE_FIELDS }}
      eventClick={handleEventClick}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <Inject services={[Day, Week, Month]} />
    </ScheduleComponent>
  );

  return (
    <>
      {showEmpty ? (
        <div className="w-full py-12 text-center">
          <p className="font-bold text-slate-500">
            You haven&apos;t registered for any events yet.
          </p>
          <p className="mt-2 text-slate-500">
            Register for events to see them on your calendar.
          </p>
        </div>
      ) : (
        <div className="h-[650px] w-full">
          {isFetching && (
            <div className="mb-2 px-1 text-sm text-slate-500">Loading…</div>
          )}
          {isDesktop ? (
            <div
              className="h-full"
              onMouseOver={handleScheduleMouseOver}
              onMouseLeave={clearHover}
            >
              {schedule}
            </div>
          ) : (
            schedule
          )}
        </div>
      )}

      <Popover
        open={Boolean(hoverAnchorEl) && !isDialogOpen}
        anchorEl={hoverAnchorEl}
        onClose={() => {
          setHoverAnchorEl(null);
          setHoverEvent(null);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
        disableScrollLock
        className="pointer-events-none"
        slotProps={{
          paper: {
            onMouseEnter: () => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
            },
            onMouseLeave: clearHover,
            className: 'pointer-events-auto overflow-visible bg-transparent shadow-none',
          },
        }}
      >
        {hoverEvent && <EventCard event={hoverEvent} />}
      </Popover>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        slotProps={{
          paper: {
            className: 'bg-transparent shadow-none overflow-visible',
          },
        }}
      >
        {selectedEvent && <EventCard event={selectedEvent} />}
      </Dialog>
    </>
  );
};

export default EventCalendar;
