import { differenceInCalendarDays } from "date-fns";
import { useContext } from "react";
import { QuestionsContext } from "../context/QuestionsContext";
import { Link } from "react-router-dom";
import { generatePlan } from "../lib/planGenerator";

const weekDayByOptionId: Record<number, number> = {
  801: 1,
  802: 2,
  803: 3,
  804: 4,
  805: 5,
  806: 6,
  807: 0,
};

export default function PlanResultsPage() {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("QuestionsContext must be used within a QuestionsProvider");
  }
  const { questions } = context;
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

  const input = {
    goalTimeMin: marathonDesiredTime,
    raceDate: dateOfTheMarathon,
    startDate: dateNow,
    experience,
    daysAvailable,
  };

  const plan = generatePlan(input);

  return (
    <div className="flex flex-col justify-center items-center text-center mt-20 text-xl">
      <h1>You have {(daysUntilMarathon)} days left until the marathon.</h1>
      <h2>You want to run the marathon in {(marathonDesiredTime)} minutes.</h2>
      <h2>Q 1 How serious are you about preparing for a marathon? : {(howSeriousAnswer)}</h2>
      <h2>Q 2 What is your biological gender? : {(gender)}</h2>
      <h2>Q 3 How old are you? : {(age)}</h2>
      <h2>Q 4 Have you done running before? : {(experience)}</h2>
      <h2>Q 5 How high are you? (in centimeters)? : {(height)}</h2>
      <h2>Q 6 What is your weight? (in kilograms)? : {(weight)}</h2>
      <h2>Q 7 What is the date when you want to run a Marathon : {dateOfTheMarathon ? (dateOfTheMarathon.toLocaleDateString()) : ("Is not known")}</h2>
      <h2>Q 8 What days do you have time for running? (30 - 120 min) : {dayLabels.join(", ") || "None selected"}</h2>
      <div className="mt-10">
        <h2 className="text-2xl mb-4">Your Training Plan</h2>

        {plan.map(week => (
          <div key={week.week} className="mb-6 p-4 border rounded">
            <h3>Week {week.week}</h3>
            <p>Total: {week.totalKm} km</p>
            <p>Long run: {week.longRunKm} km</p>

            <ul>
              {week.workouts.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>

            <div className="mt-4">
              {week.days.map((day) => (
                <div key={day.date} className="flex flex-col border-t py-2">
                  <span>{day.dayName}, {day.label}</span>
                  <span>{day.workout}</span>
                  <span>{day.distanceKm > 0 ? `${day.distanceKm} km` : "Recovery day"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-18 mb-20">
        <Link to={"/questions"}>
          <button
            className={`flex flex-nowrap gap-2 justify-center items-center group text-center px-4 py-4 border rounded-xl bg-secondary text-black hover:bg-black hover:text-primary transition-all duration-100 cursor-pointer `}
            onClick={() => localStorage.clear()}
          >
            Fill the Form Again
          </button>
        </Link>

      </div>
    </div>
  )
}
