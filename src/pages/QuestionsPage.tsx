import { useContext, useState } from "react"
import { QuestionsContext } from "../context/QuestionsContext"




export default function QuestionsPage() {

  const context = useContext(QuestionsContext);
  const [questionNumber, setQuestionNumber] = useState(0);

  if (!context) {
    throw new Error("QuestionsContext must be used within a QuestionsProvider");
  }

  const { questions, setQuestions } = context;

  function handleAnswerChange(questionId: number, value: number | Date) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;

        switch (q.userAnswerType) {
          case "multiple-choice":
            return { ...q, userAnswer: { selectedOptionIds: value as number } };
          case "number":
            return { ...q, userAnswer: { numberResponse: value as number } };
          case "date":
            return { ...q, userAnswer: { dateResponse: value as Date } };
          default:
            return q;
        }
      })
    );

  }

  function handleNextButton() {
    if (questionNumber < questions.length - 1) {
      setQuestionNumber(prev => prev + 1);
    } else {
      //add link to the calculation and display of the plan
    }
  }

  function handlePreviousButton() {
    if (questionNumber > 0) {
      setQuestionNumber(prev => prev - 1);
    }
  }

  


  return (
    <div className="flex flex-col gap-12 items-center text-center justify-between text-xl h-140">
      <h2 className="mt-40 ">{questionNumber === questions.length ? "" : `${questions[questionNumber].question}`}</h2>

      <div>
        {questions[questionNumber].userAnswerType === "multiple-choice" &&
          questions[questionNumber].answerOptions?.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswerChange(questions[questionNumber].id, option.id)}
              className={`mr-2 px-3 py-1 border rounded 
                  ${questions[questionNumber].userAnswer.selectedOptionIds === option.id ? "bg-red-700 text-white" : ""}`}
            >
              {option.text}
            </button>
          ))}

        {questions[questionNumber].userAnswerType === "number" && (
          <input
            type="number"
            onChange={e => handleAnswerChange(questions[questionNumber].id, Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        )}

        {questions[questionNumber].userAnswerType === "date" && (
          <input
            type="date"
            onChange={e => handleAnswerChange(questions[questionNumber].id, new Date(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        )}

      </div>

      <div className="flex gap-18">
        <button
          onClick={() => handlePreviousButton()}
          className={`w-25 text-center px-3 py-1 border rounded-xl bg-secondary text-black ${questionNumber === 0 ? "text-gray-500" : "text-black"}`}>
          Previous
        </button>

        <button
          onClick={() => { handleNextButton() }}
          className={`w-25 text-center px-3 py-1 border rounded-xl bg-secondary text-black`}>
          {questionNumber === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>

    </div>
  )
}