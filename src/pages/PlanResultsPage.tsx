import { differenceInDays } from "date-fns";
import { useContext } from "react";
import { QuestionsContext } from "../context/QuestionsContext";


export default function PlanResultsPage() {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("QuestionsContext must be used within a QuestionsProvider");
  }
  const { questions } = context;
  const dateOfTheMarathon = questions[6].userAnswer.dateResponse;
  const dateNow = new Date();
  const daysUntilMarathon = dateOfTheMarathon ? differenceInDays(dateOfTheMarathon, dateNow) : null;
  const time = questions[8].userAnswer.timeResponse;
  const howSeriousAnswer = questions[0].answerOptions?.find((opt) => opt.id === questions[0].userAnswer.selectedOptionIds)?.text;
  const gender = questions[1].answerOptions?.find((opt) => opt.id === questions[1].userAnswer.selectedOptionIds)?.text;
  const age = questions[2].userAnswer.numberResponse;
  const experience = questions[3].answerOptions?.find((opt) => opt.id === questions[3].userAnswer.selectedOptionIds)?.text;
  const weight = questions[4].userAnswer.numberResponse;
  const daysAvailableSelectedIds = questions[7].userAnswer.selectedMultipleOptionIds ?? [];
  const daysAvailable = questions[7].answerOptions?.filter(opt => daysAvailableSelectedIds.includes(opt.id)).map(opt => opt.id - 800);

  console.log(daysAvailable);


  if (!time || time.hours === undefined || time.minutes === undefined) {
    throw new Error("No marathon time selected.");
  }

  const marathonDesiredTime = time.hours * 60 + time.minutes;



  return (
    <div className="flex flex-col justify-center items-center text-center mt-20 text-xl">
      <h1>You have {(daysUntilMarathon)} days left until the marathon.</h1>
      <h2>You want to run the marathon in {(marathonDesiredTime)} minutes.</h2>
      <h2>Q 1 How serious are you about preparing for a marathon? : {(howSeriousAnswer)}</h2>
      <h2>Q 2 What is your biological gender? : {(gender)}</h2>
      <h2>Q 3 How old are you? : {(age)}</h2>
      <h2>Q 4 Have you done running before? : {(experience)}</h2>
      <h2>Q 5 What is your weight? (in kilograms)? : {(weight)}</h2>
      <h2>Q 6 What is the date when you want to run a Marathon : {dateOfTheMarathon ? (dateOfTheMarathon.toLocaleDateString()) : ("Is not known")}</h2>
      <h2>Q 7 What days do you have time for running? (30 - 120 min) : {(daysAvailable)}</h2>


    </div>
  )
}