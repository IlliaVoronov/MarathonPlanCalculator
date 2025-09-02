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


  return (
    <div>
      <h1>You have {(daysUntilMarathon)} days left until the marathon</h1>
    </div>
  )
}