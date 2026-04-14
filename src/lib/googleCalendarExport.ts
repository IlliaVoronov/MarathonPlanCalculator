import { addDays, format } from "date-fns";
import type { DayPlan } from "./planGenerator";

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function createEvent(day: DayPlan): string {
  const startDate = day.date.replace(/-/g, "");
  const endDate = format(addDays(new Date(day.date), 1), "yyyyMMdd");
  const timestamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const title = `Marathon Prep: ${day.preview}`;
  const description = `${day.workout}\n\n${day.description}`;

  return [
    "BEGIN:VEVENT",
    `UID:${day.date}-marathon-prep@local`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
  ].join("\r\n");
}

export function downloadGoogleCalendarFile(days: DayPlan[]) {
  const events = days
    .filter((day) => day.type !== "rest")
    .map(createEvent)
    .join("\r\n");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MarathonPrep//Training Plan//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "marathon-training-plan.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
