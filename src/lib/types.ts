export type CourtId = 1 | 2 | 3;

export interface CalendarEvent {
  id: string;
  title: string;
  courtId: CourtId;
  /** in HH:mm 24h local time */
  startTime: string;
  /** in HH:mm 24h local time */
  endTime: string;
  colorHex: string; // e.g. #a855f7
}

export interface DaySchedule {
  /** ISO date string YYYY-MM-DD (local) */
  date: string;
  events: CalendarEvent[];
}


