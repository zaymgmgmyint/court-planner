import { DaySchedule } from "./types";

export const mockSchedule: DaySchedule = {
  date: "2025-09-23",
  events: [
    {
      id: "e1",
      title: "Coach Sarah",
      courtId: 1,
      startTime: "07:00",
      endTime: "08:30",
      colorHex: "#c084fc", // pinkish purple
    },
    {
      id: "e2",
      title: "Team Alpha",
      courtId: 2,
      startTime: "08:00",
      endTime: "09:30",
      colorHex: "#6366f1", // indigo
    },
    {
      id: "e3",
      title: "Coach Mike",
      courtId: 3,
      startTime: "09:00",
      endTime: "10:30",
      colorHex: "#c084fc",
    },
    {
      id: "e4",
      title: "Tennis Club",
      courtId: 1,
      startTime: "10:00",
      endTime: "12:00",
      colorHex: "#6366f1",
    },
    {
      id: "e5",
      title: "Coach Lisa",
      courtId: 2,
      startTime: "14:00",
      endTime: "15:30",
      colorHex: "#c084fc",
    },
  ],
};

export const courts = [
  { id: 1 as const, name: "Court 1" },
  { id: 2 as const, name: "Court 2" },
  { id: 3 as const, name: "Court 3" },
];


