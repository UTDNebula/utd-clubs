'use client';

import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import { isSameDay, startOfDay } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import EventCard from '@/systems/events/EventCard';
import { useTRPC } from '@/trpc/react';
import { type RouterOutputs } from '@/trpc/shared';
import {
  getRangeForView,
  type CalendarRange,
} from '@/common/utils/calendarRange';
import {
  calendarParamsSchema,
  type CalendarParamsSchema,
} from '@/common/utils/eventFilter';
import { createParamSetter } from '@/common/utils/searchParams';

type RegisteredEvent =
  RouterOutputs['user']['events']['getRegisteredEventsByRange'][number];

const SCHEDULE_FIELDS = {
  id: 'Id',
  subject: { name: 'Subject' },
  startTime: { name: 'StartTime' },
  endTime: { name: 'EndTime' },
  location: { name: 'Location' },
  description: { name: 'Description' },
} as const;

export const setCalendarParams = createParamSetter<CalendarParamsSchema>();

const EventCalendar = () => {
  const searchParams = useSearchParams();
  const params = calendarParamsSchema.parse(Object.fromEntries(searchParams));

  const scheduleRef = useRef<ScheduleComponent | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [initialDate] = useState(startOfDay(params.anchor ?? new Date()));
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [initialView] = useState(params.view ?? (isDesktop ? 'Week' : 'Day'));
  const isFinePointer = useMediaQuery('(pointer: fine)');

  const [selectedEvent, setSelectedEvent] = useState<RegisteredEvent | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoverAnchorEl, setHoverAnchorEl] = useState<Element | null>(null);
  const [hoverEvent, setHoverEvent] = useState<RegisteredEvent | null>(null);
  const [range, setRange] = useState<CalendarRange>(() =>
    getRangeForView(initialView, initialDate),
  );

  const api = useTRPC();
  const router = useRouter();

  const { data: events = [], isFetching } = useQuery(
    api.user.events.getRegisteredEventsByRange.queryOptions(range, {
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

    if (isFinePointer) {
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
    if (args.requestType === 'dateNavigate') {
      setCalendarParams((params) => {
        // Don't set anchor if today and doesn't already exist; likely means Today button clicked
        if (isSameDay(anchor, new Date()) && !params.has('anchor')) return;
        params.set('anchor', anchor.toISOString().slice(0, 10));
      });
    } else if (args.requestType === 'viewNavigate') {
      setCalendarParams((params) => {
        params.set('view', view);
      });
    }
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

  const [spinnerTarget, setSpinnerTarget] = useState<HTMLElement | null>(null);

  const handleCreated = () => {
    const spinnerTarget = scheduleRef.current?.element.querySelector(
      '#calendar-spinner',
    ) as HTMLElement | null;
    const todayButton = scheduleRef.current?.element.querySelector(
      '.e-toolbar-item.e-today > button:first-of-type',
    ) as HTMLButtonElement | null;
    todayButton?.addEventListener('click', () => {
      setCalendarParams((params) => {
        params.delete('anchor');
      });
    });

    setSpinnerTarget(spinnerTarget);
  };

  const schedule = (
    <ScheduleComponent
      ref={(el: ScheduleComponent | null) => {
        scheduleRef.current = el;
      }}
      created={handleCreated}
      selectedDate={initialDate}
      currentView={initialView}
      readonly={true}
      popupOpen={handlePopupOpen}
      actionComplete={handleActionComplete}
      eventSettings={{ dataSource: schedulerData, fields: SCHEDULE_FIELDS }}
      eventClick={handleEventClick}
      workHours={{ highlight: false }}
      toolbarItems={[
        { name: 'Previous', align: 'Left' },
        { name: 'Next', align: 'Left' },
        { name: 'DateRangeText', align: 'Left' },
        {
          name: 'Custom',
          template: '<div id="calendar-spinner" />',
          overflow: 'Show',
        },
        { name: 'Today', align: 'Right' },
        { name: 'Views', align: 'Right' },
      ]}
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
      <div
        className="use-sticky-schedule-header [--sticky-schedule-header-padding:calc(var(--spacing)_*_4)]"
        onMouseOver={isFinePointer ? handleScheduleMouseOver : undefined}
        onMouseLeave={isFinePointer ? clearHover : undefined}
      >
        {schedule}
      </div>

      {spinnerTarget &&
        createPortal(
          <div className="flex h-full cursor-default items-center">
            <CircularProgress
              size="1.5rem"
              className={!isFetching ? 'invisible' : ''}
            />
          </div>,
          spinnerTarget,
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
            className:
              'pointer-events-auto overflow-visible bg-transparent shadow-none',
            elevation: 0,
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
            elevation: 0,
          },
        }}
      >
        {selectedEvent && <EventCard event={selectedEvent} />}
      </Dialog>
    </>
  );
};

export default EventCalendar;
