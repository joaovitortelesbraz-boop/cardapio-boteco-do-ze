export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type LocalTime = `${number}${number}:${number}${number}`;

export interface WeeklyOpeningPeriod {
  days: readonly IsoWeekday[];
  opensAt: LocalTime;
  closesAt: LocalTime;
  closesDayOffset: 0 | 1;
}

export interface VenueOpeningSchedule {
  timeZone: string;
  periods: readonly WeeklyOpeningPeriod[];
}

export interface ScheduleEvent {
  weekday: IsoWeekday;
  dayOffset: number;
  localTime: LocalTime;
}

export interface VenueOpeningStatus {
  state: "open" | "closed";
  isOpen: boolean;
  label: "Aberto agora" | "Fechado";
  detail: string;
  current: {
    weekday: IsoWeekday;
    localTime: LocalTime;
  };
  nextOpening: ScheduleEvent;
  nextClosing: ScheduleEvent;
  nextTransition: ScheduleEvent & {
    kind: "opens" | "closes";
  };
}

interface WeeklyInterval {
  start: number;
  end: number;
}

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

const weekdayByShortName: Readonly<Record<string, IsoWeekday>> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const formatterByTimeZone = new Map<string, Intl.DateTimeFormat>();

function parseLocalTime(value: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);

  if (!match) {
    throw new Error(`Horário de funcionamento inválido: "${value}".`);
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatLocalTime(minutes: number): LocalTime {
  const normalizedMinutes =
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalizedMinutes / 60);
  const remainder = normalizedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}` as LocalTime;
}

function getFormatter(timeZone: string) {
  const cachedFormatter = formatterByTimeZone.get(timeZone);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.DateTimeFormat(
    "en-US-u-ca-iso8601-nu-latn",
    {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    },
  );

  formatterByTimeZone.set(timeZone, formatter);
  return formatter;
}

function getLocalDateTime(now: Date, timeZone: string) {
  const parts = getFormatter(timeZone).formatToParts(now);
  const weekdayName = parts.find((part) => part.type === "weekday")?.value;
  const hours = Number(parts.find((part) => part.type === "hour")?.value);
  const minutes = Number(parts.find((part) => part.type === "minute")?.value);
  const weekday = weekdayName ? weekdayByShortName[weekdayName] : undefined;

  if (
    weekday === undefined ||
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    throw new Error(
      `Não foi possível obter o horário local para o fuso "${timeZone}".`,
    );
  }

  return {
    weekday,
    minutes: hours * 60 + minutes,
  };
}

function buildWeeklyIntervals(
  schedule: VenueOpeningSchedule,
): WeeklyInterval[] {
  const intervals = schedule.periods.flatMap((period) => {
    const opensAt = parseLocalTime(period.opensAt);
    const closesAt = parseLocalTime(period.closesAt);
    const duration =
      period.closesDayOffset * MINUTES_PER_DAY + closesAt - opensAt;

    if (period.days.length === 0 || duration <= 0) {
      throw new Error("Período de funcionamento inválido.");
    }

    return period.days.map((weekday) => {
      if (weekday < 1 || weekday > 7) {
        throw new Error(`Dia da semana inválido: "${weekday}".`);
      }

      const start = (weekday - 1) * MINUTES_PER_DAY + opensAt;

      return {
        start,
        end: start + duration,
      };
    });
  });

  if (intervals.length === 0) {
    throw new Error("Nenhum período de funcionamento foi configurado.");
  }

  return intervals;
}

function toScheduleEvent(
  weekMinute: number,
  currentDayIndex: number,
): ScheduleEvent {
  const eventDayIndex = Math.floor(weekMinute / MINUTES_PER_DAY);
  const normalizedDayIndex =
    ((eventDayIndex % 7) + 7) % 7;

  return {
    weekday: (normalizedDayIndex + 1) as IsoWeekday,
    dayOffset: eventDayIndex - currentDayIndex,
    localTime: formatLocalTime(weekMinute),
  };
}

export function getVenueOpeningStatus(
  schedule: VenueOpeningSchedule,
  now: Date,
): VenueOpeningStatus {
  const localDateTime = getLocalDateTime(now, schedule.timeZone);
  const currentDayIndex = localDateTime.weekday - 1;
  const currentWeekMinute =
    currentDayIndex * MINUTES_PER_DAY + localDateTime.minutes;
  const weeklyIntervals = buildWeeklyIntervals(schedule);

  const currentInterval = weeklyIntervals
    .flatMap((interval) =>
      [-MINUTES_PER_WEEK, 0, MINUTES_PER_WEEK].map((weekOffset) => ({
        start: interval.start + weekOffset,
        end: interval.end + weekOffset,
      })),
    )
    .filter(
      (interval) =>
        interval.start <= currentWeekMinute && currentWeekMinute < interval.end,
    )
    .sort((first, second) => second.end - first.end)[0];

  const nextOpeningInterval = weeklyIntervals
    .map((interval) => ({
      start:
        interval.start > currentWeekMinute
          ? interval.start
          : interval.start + MINUTES_PER_WEEK,
      end:
        interval.start > currentWeekMinute
          ? interval.end
          : interval.end + MINUTES_PER_WEEK,
    }))
    .sort((first, second) => first.start - second.start)[0];

  const isOpen = currentInterval !== undefined;
  const nextOpening = toScheduleEvent(
    nextOpeningInterval.start,
    currentDayIndex,
  );
  const nextClosing = toScheduleEvent(
    isOpen ? currentInterval.end : nextOpeningInterval.end,
    currentDayIndex,
  );
  const transitionEvent = isOpen ? nextClosing : nextOpening;

  return {
    state: isOpen ? "open" : "closed",
    isOpen,
    label: isOpen ? "Aberto agora" : "Fechado",
    detail: `${isOpen ? "Fecha" : "Abre"} às ${transitionEvent.localTime}`,
    current: {
      weekday: localDateTime.weekday,
      localTime: formatLocalTime(localDateTime.minutes),
    },
    nextOpening,
    nextClosing,
    nextTransition: {
      ...transitionEvent,
      kind: isOpen ? "closes" : "opens",
    },
  };
}
