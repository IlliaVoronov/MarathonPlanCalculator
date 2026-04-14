import { addDays, differenceInCalendarDays, format, isAfter, startOfDay } from "date-fns";

export interface PlanInput {
  goalTimeMin: number;
  raceDate: Date;
  startDate?: Date;
  experience?: string;
  daysAvailable?: number[];
}

export interface DayPlan {
  date: string;
  label: string;
  dayName: string;
  workout: string;
  distanceKm: number;
}

export interface WeekPlan {
  week: number;
  totalKm: number;
  longRunKm: number;
  workouts: string[];
  days: DayPlan[];
}

function roundToHalf(value: number): number {
  return Math.max(0, Math.round(value * 2) / 2);
}

function getBaseKm(experience?: string): number {
  if (experience === "Beginner") return 30;
  if (experience === "Ran more then 10 km.") return 40;
  if (experience === "Experienced runner") return 60;
  return 80;
}

export function generatePlan(input: PlanInput): WeekPlan[] {
  const raceDate = startOfDay(input.raceDate);
  const startDate = startOfDay(input.startDate ?? new Date());

  if (isAfter(startDate, raceDate)) {
    return [];
  }

  const daysUntilRace = differenceInCalendarDays(raceDate, startDate) + 1;
  const weeks = Math.max(1, Math.ceil(daysUntilRace / 7));
  const paceMinPerKm = input.goalTimeMin / 42.195;
  const baseKm = getBaseKm(input.experience);

  const selectedDays = [...new Set(input.daysAvailable?.length ? input.daysAvailable : [2, 4, 6])].sort((a, b) => a - b);
  const longRunDay = selectedDays.includes(0) ? 0 : selectedDays[selectedDays.length - 1];
  const workoutDay = selectedDays.find((day) => day !== longRunDay) ?? longRunDay;

  const plan: WeekPlan[] = [];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    const week = weekIndex + 1;
    const weekStart = addDays(startDate, weekIndex * 7);
    const progression = 1 + week / weeks;

    let weeklyKm = baseKm * progression;
    if (week % 4 === 0) {
      weeklyKm *= 0.7;
    }

    const longRunKm = roundToHalf(Math.min(weeklyKm * 0.3, 32));
    const tempoKm = roundToHalf(Math.max(6, Math.min(weeklyKm * 0.2, 14)));
    const easyRunCount = Math.max(selectedDays.filter((day) => day !== longRunDay && day !== workoutDay).length, 0);
    const easyTotalKm = Math.max(weeklyKm - longRunKm - tempoKm, 0);
    const easyRunKm = easyRunCount > 0 ? roundToHalf(easyTotalKm / easyRunCount) : 0;

    const days: DayPlan[] = [];

    for (let offset = 0; offset < 7; offset++) {
      const currentDate = addDays(weekStart, offset);
      if (isAfter(currentDate, raceDate)) {
        break;
      }

      const weekday = currentDate.getDay();
      let workout = "Rest";
      let distanceKm = 0;

      if (selectedDays.includes(weekday)) {
        if (weekday === longRunDay) {
          workout = `Long run @ ${(paceMinPerKm * 1.2).toFixed(2)} min/km`;
          distanceKm = longRunKm;
        } else if (weekday === workoutDay) {
          workout = `Tempo run @ ${(paceMinPerKm * 0.92).toFixed(2)} min/km`;
          distanceKm = tempoKm;
        } else {
          workout = `Easy run @ ${(paceMinPerKm * 1.25).toFixed(2)} min/km`;
          distanceKm = easyRunKm;
        }
      }

      days.push({
        date: format(currentDate, "yyyy-MM-dd"),
        label: format(currentDate, "dd MMM yyyy"),
        dayName: format(currentDate, "EEEE"),
        workout,
        distanceKm,
      });
    }

    plan.push({
      week,
      totalKm: roundToHalf(days.reduce((sum, day) => sum + day.distanceKm, 0)),
      longRunKm,
      workouts: [
        `Easy runs @ ${(paceMinPerKm * 1.25).toFixed(2)} min/km`,
        `Tempo run @ ${(paceMinPerKm * 0.92).toFixed(2)} min/km`,
        `Long run ${longRunKm} km`,
      ],
      days,
    });
  }

  return plan;
}
