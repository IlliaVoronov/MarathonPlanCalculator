import { useContext, useState } from "react";
import { QuestionsContext } from "../context/QuestionsContext";
import { ArrowIconLeft, ArrowIconRight } from "../assets/svgs";
import ChoseAnswerWarning from "../components/ChoseAnswerWarning";



export default function QuestionsPage() {

  const context = useContext(QuestionsContext);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showWarning, setShowWarning] = useState(false); // for asking user for input before clicking "next"


  if (!context) {
    throw new Error("QuestionsContext must be used within a QuestionsProvider");
  }

  const { questions, setQuestions } = context;

  function handleAnswerChange(questionId: number, value: number | Date) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;

        switch (q.userAnswerType) {
          case "one-choice":
            setShowWarning((q.userAnswer.selectedOptionIds === value)); // hiding warning message when an option is chosen
            return {
              ...q, userAnswer: {
                selectedOptionIds:
                  q.userAnswer.selectedOptionIds === value
                    ? undefined
                    : (value as number),
              }
            };
          case "multiple-choice": {
            const selected = q.userAnswer.selectedMultipleOptionIds ?? [];
            const alreadySelected = selected.includes(value as number);

            setShowWarning(false); 

            return {
              ...q,
              userAnswer: {
                ...q.userAnswer,
                selectedMultipleOptionIds: alreadySelected
                  ? selected.filter(id => id !== (value as number)) // remove if already selected
                  : [...selected, value as number], // add if not selected
              },
            };
          }

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

  function isAnswered(questionId: number): boolean {
    const question = questions.find(q => q.id === questionId);
    if (!question) return false;

    return Object.values(question.userAnswer).some(val => val !== undefined);
  }


  function handleNextButton() {
    if (questionNumber < questions.length - 1 && isAnswered(questions[questionNumber].id)) {
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
    <div className="flex flex-col gap-12 items-center text-center justify-between text-xl h-screen">
      <h2 className="mt-40 ">{questionNumber === questions.length ? "" : `${questions[questionNumber].question}`}</h2>

      <div>
        {questions[questionNumber].userAnswerType === "one-choice" &&
          questions[questionNumber].answerOptions?.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswerChange(questions[questionNumber].id, option.id)}
              className={`mr-2 px-3 py-1 border rounded cursor-pointer
                  ${questions[questionNumber].userAnswer.selectedOptionIds === option.id ? "bg-red-700 text-white" : "hover:bg-black hover:text-primary transition-all delay-100"}`}
            >
              {option.text}
            </button>
          ))}

        {questions[questionNumber].userAnswerType === "multiple-choice" &&
          questions[questionNumber].answerOptions?.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswerChange(questions[questionNumber].id, option.id)}
              className={`mr-2 px-3 py-1 border rounded cursor-pointer
                  ${questions[questionNumber].userAnswer.selectedMultipleOptionIds?.includes(option.id)  ? "bg-red-700 text-white" : "hover:bg-black hover:text-primary transition-all delay-100"}`}
            >
              {option.text}
            </button>
          ))}

        {questions[questionNumber].userAnswerType === "number" && (
          <input
            type="number"
            min={13}
            max={120}
            onChange={e => {
              const value = Number(e.target.value);

              if (value < 13) {
                // setToastMessage("Sorry, you should grow up before running a marathon");

              }
              if (value > 120) {
                // setToastMessage("Sorry, you are too old for a marathon");
              }

              handleAnswerChange(questions[questionNumber].id, value);
            }}

            className="border px-6 py-5 rounded"
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

      <div className="flex gap-18 mb-20">
        <button
          onClick={() => {
            handlePreviousButton();
            if (questionNumber !== 0) { setShowWarning(false) };
          }}
          className={`flex flex-nowrap gap-2 justify-center items-center group text-center px-4 py-4 border rounded-xl text-black cursor-pointer  ${questionNumber === 0 ? "text-gray-500 bg-inactive" : "bg-secondary text-black hover:bg-black hover:text-primary transition-all duration-100"}`}>
          <div className={`w-4 h-4 ${questionNumber === 0 ? "text-gray-500" : "text-black group-hover:text-primary transition-all duration-100"}`}><ArrowIconLeft /></div>
          Previous
        </button>

        {showWarning && (<ChoseAnswerWarning questionType={questions[questionNumber].userAnswerType} />)}

        <button
          onClick={() => {
            handleNextButton();
            setShowWarning(!isAnswered(questions[questionNumber].id));
          }}
          // disabled={!isAnswered(questions[questionNumber].id)}
          className={`flex flex-nowrap gap-2  justify-center items-center group text-center px-4 py-4 border rounded-xl cursor-pointer transition-all duration-100 ${isAnswered(questions[questionNumber].id) ? "bg-secondary text-black hover:bg-black hover:text-primary" : "text-gray-500 bg-inactive"}`}>
          {questionNumber === questions.length - 1 ? "Finish" : "Next"}
          <div className={` w-4 h-4 ${isAnswered(questions[questionNumber].id) ? "text-black group-hover:text-primary transition-all duration-100" : "text-gray-500"}`}><ArrowIconRight /></div>
        </button>


      </div>

    </div>
  )
}