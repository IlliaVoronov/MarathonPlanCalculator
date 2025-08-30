import type { AnswerType } from "../context/QuestionsProvider";


export default function ChoseAnswerWarning({ questionType }: { questionType: AnswerType }) {

  let message: string | null = null;

  switch (questionType) {
    case "one-choice":
      message = "Please choose an answer before going to the next question";
      break;
    case "multiple-choice":
      message = "Please choose an answer before going to the next question";
      break;
    case "number":
      message = "Please enter a number before going to the next question";
      break;
    case "date":
      message = "Please select a date before going to the next question";
      break;
    default:
      message = null;
  }
  
  if (!message) return null;

  return (
    <div className="fixed bottom-40 left-1/2 -translate-x-1/2 bg-red-600 text-white min-w-[70%] md:min-w-0 px-6 py-3 rounded-xl shadow-lg animate-fade-up animate-duration-[400ms]">
      <h4 className="text-lg font-bold">{message}</h4>
    </div>
  )
}