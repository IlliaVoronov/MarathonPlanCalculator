import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { QuestionsContext } from "../context/QuestionsContext";
import { generatePlan, type DayPlan } from "../lib/planGenerator";
import { createInitialQuestions } from "../context/QuestionsProvider";

const weekDayByOptionId: Record<number, number> = {
  801: 1,
  802: 2,
  803: 3,
  804: 4,
  805: 5,
  806: 6,
  807: 0,
};

const calendarHeadings = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWorkoutAccent(type: DayPlan["type"]): string {
  if (type === "long") return "border-lime-300 bg-lime-100/90 text-black";
  if (type === "tempo") return "border-orange-300 bg-orange-100/90 text-black";
  if (type === "easy") return "border-sky-300 bg-sky-100/90 text-black";
  return "border-white/15 bg-white/5 text-white/60";
}

export default function PlanResultsPage() {
  const context = useContext(QuestionsContext);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  if (!context) {
    throw new Error("QuestionsContext must be used within a QuestionsProvider");
  }

  const { questions, setQuestions } = context;
  const dateOfTheMarathon = questions[6].userAnswer.dateResponse;
  const dateNow = new Date();
  const daysUntilMarathon = dateOfTheMarathon ? differenceInCalendarDays(dateOfTheMarathon, dateNow) : null;
  const time = questions[8].userAnswer.timeResponse;
  const howSeriousAnswer = questions[0].answerOptions?.find((opt) => opt.id === questions[0].userAnswer.selectedOptionIds)?.text;
  const gender = questions[1].answerOptions?.find((opt) => opt.id === questions[1].userAnswer.selectedOptionIds)?.text;
  const age = questions[2].userAnswer.numberResponse;
  const experience = questions[3].answerOptions?.find((opt) => opt.id === questions[3].userAnswer.selectedOptionIds)?.text;
  const height = questions[4].userAnswer.numberResponse;
  const weight = questions[5].userAnswer.numberResponse;
  const daysAvailableSelectedIds = questions[7].userAnswer.selectedMultipleOptionIds ?? [];
  const dayLabels = questions[7].answerOptions
    ?.filter((opt) => daysAvailableSelectedIds.includes(opt.id))
    .map((opt) => opt.text) ?? [];
  const daysAvailable = daysAvailableSelectedIds
    .map((id) => weekDayByOptionId[id])
    .filter((day): day is number => day !== undefined);

  if (!time || time.hours === undefined || time.minutes === undefined) {
    throw new Error("No marathon time selected.");
  }

  if (!dateOfTheMarathon) {
    throw new Error("No marathon date selected.");
  }

  const marathonDesiredTime = time.hours * 60 + time.minutes;
  const plan = generatePlan({
    goalTimeMin: marathonDesiredTime,
    raceDate: dateOfTheMarathon,
    startDate: dateNow,
    experience,
    daysAvailable,
  });

  const plannedDays = plan.flatMap((week) => week.days).filter((day) => day.type !== "rest");
  const plannedDaysByDate = Object.fromEntries(plannedDays.map((day) => [day.date, day]));
  const firstMonth = startOfMonth(startOfDay(dateNow));
  const lastMonth = startOfMonth(startOfDay(dateOfTheMarathon));
  const [visibleMonth, setVisibleMonth] = useState(firstMonth);
  const monthLabel = format(visibleMonth, "MMMM yyyy");
  const gridStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const canGoToPreviousMonth = isAfter(visibleMonth, firstMonth);
  const canGoToNextMonth = isBefore(visibleMonth, lastMonth);
  const plannedRunsThisMonth = plannedDays.filter((day) => day.date.startsWith(format(visibleMonth, "yyyy-MM"))).length;

  function handleResetForm() {
    localStorage.removeItem("questions_v3");
    setQuestions(createInitialQuestions());
    setSelectedDay(null);
  }

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur sm:p-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">Training calendar</h1>
          <p className="mt-2 text-white/80">
            {daysUntilMarathon} days until race day. Goal finish time: {marathonDesiredTime} minutes.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Commitment: {howSeriousAnswer}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Runner profile: {experience}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Race date: {dateOfTheMarathon.toLocaleDateString()}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Run days: {dayLabels.join(", ") || "None selected"}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Gender: {gender}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Age: {age}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Height: {height} cm</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Weight: {weight} kg</div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <div className="rounded-full border border-lime-300 bg-lime-100 px-3 py-1 text-black">Long run</div>
          <div className="rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-black">Tempo run</div>
          <div className="rounded-full border border-sky-300 bg-sky-100 px-3 py-1 text-black">Easy run</div>
          <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70">Rest day</div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-3 shadow-xl backdrop-blur sm:p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!canGoToPreviousMonth}
              onClick={() => canGoToPreviousMonth && setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="text-center">
              <h2 className="text-xl font-semibold sm:text-2xl">{monthLabel}</h2>
              <span className="text-sm text-white/60">{plannedRunsThisMonth} planned runs</span>
            </div>

            <button
              type="button"
              disabled={!canGoToNextMonth}
              onClick={() => canGoToNextMonth && setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.15em] text-white/50 sm:gap-2 sm:text-xs">
            {calendarHeadings.map((heading) => (
              <div key={heading} className="py-2">
                {heading}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((dayDate) => {
              const dayKey = format(dayDate, "yyyy-MM-dd");
              const dayPlan = plannedDaysByDate[dayKey];
              const isInMonth = isSameMonth(dayDate, visibleMonth);
              const isPlannedDay = Boolean(dayPlan);

              return (
                <button
                  key={dayKey}
                  type="button"
                  disabled={!isPlannedDay}
                  onClick={() => dayPlan && setSelectedDay(dayPlan)}
                  className={[
                    "min-h-20 rounded-2xl border p-1.5 text-left align-top transition-all sm:min-h-28 sm:p-2",
                    isInMonth ? "opacity-100" : "opacity-30",
                    isPlannedDay
                      ? `${getWorkoutAccent(dayPlan.type)} cursor-pointer hover:-translate-y-0.5 hover:shadow-lg`
                      : "border-white/10 bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold sm:text-sm">{format(dayDate, "d")}</span>
                    {isPlannedDay && (
                      <span className="hidden rounded-full bg-black/10 px-2 py-0.5 text-[10px] uppercase tracking-wide sm:inline-block">
                        {dayPlan.type}
                      </span>
                    )}
                  </div>

                  {isPlannedDay ? (
                    <div className="mt-1 space-y-1 sm:mt-2">
                      <p className="overflow-hidden text-[10px] font-medium leading-tight sm:text-xs">{dayPlan.preview}</p>
                      <p className="hidden text-xs opacity-80 sm:block">{dayPlan.paceMinPerKm?.toFixed(2)} min/km</p>
                    </div>
                  ) : (
                    <div className="mt-3 text-[10px] text-white/40 sm:mt-6 sm:text-xs">Recovery</div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-10 mb-20 flex justify-center">
          <Link to={"/questions"}>
            <button
              className="flex flex-nowrap items-center justify-center gap-2 rounded-xl border bg-secondary px-4 py-4 text-center text-black transition-all duration-100 hover:bg-black hover:text-primary"
              onClick={handleResetForm}
            >
              Fill the Form Again
            </button>
          </Link>
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-4 text-white shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">{selectedDay.type} session</p>
                <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
                  {selectedDay.dayName}, {selectedDay.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80 transition-colors hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className={`rounded-2xl border p-4 ${getWorkoutAccent(selectedDay.type)}`}>
                <p className="text-sm uppercase tracking-wide opacity-70">Workout</p>
                <p className="mt-1 text-lg font-semibold">{selectedDay.workout}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-wide text-white/50">Distance</p>
                <p className="mt-1 text-lg">{selectedDay.distanceKm} km</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-wide text-white/50">Full description</p>
                <p className="mt-2 text-white/85">{selectedDay.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
