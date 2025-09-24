import { useEffect, useState, type ReactNode } from "react";
import { QuestionsContext } from "./QuestionsContext";


interface AnswerOption {
  id: number;
  text: string;
}

export type AnswerType = "multiple-choice" | "number" | "date" | "one-choice" | "number-time";

export interface Question {
  id: number;
  question: string;
  userAnswerType: AnswerType; 
  answerOptions?: AnswerOption[];
  userAnswer: {
    selectedOptionIds?: number;
    selectedMultipleOptionIds?: number[];
    numberResponse?: number;
    dateResponse?: Date;
    timeResponse?: { hours: number; minutes: number };
  }; 
}

const initialQuestions: Question[] = [
  {
    id: 1,
    question: "How serious are you about preparing for a marathon?",
    userAnswerType: "one-choice",
    answerOptions: [
      { id: 101, text: "I will do it!" }, { id: 102, text: "I will try" }, {id: 103, text: "Not sure yet "}
    ],
    userAnswer: {}
  },
  {
    id: 2,
    question: "What is your biological gender?",
    userAnswerType: "one-choice",
    answerOptions: [
      { id: 201, text: "Male" }, {id: 202, text: "Female"},
    ],
    userAnswer: {}
  },
  {
    id: 3,
    question: "How old are you?",
    userAnswerType: "number",
    userAnswer: {}
  },
  {
    id: 4,
    question: "What is your running expirience?",
    userAnswerType: "one-choice",
    answerOptions: [
      { id: 401, text: "Beginner"}, { id: 402, text: "Ran more then 10 km."}, { id: 403, text: "Experienced runner"}, { id: 404, text: "Proffesional"}
    ],
    userAnswer: {}
  },
  {
    id: 5,
    question: "How high are you? (in centimeters)",
    userAnswerType: "number",
    userAnswer: {}
  },
  {
    id: 6,
    question: "What is your weight? (in kilograms)",
    userAnswerType: "number",
    userAnswer: {}
  },
  {
    id: 7,
    question: "What is the date when you want to run a Marathon?",
    userAnswerType: "date",
    userAnswer: {}
  },
  {
    id: 8,
    question: "What days do you have time for running? (30 - 120 min)",
    userAnswerType: "multiple-choice",
    answerOptions: [
      { id: 801, text: "Monday"}, { id: 802, text: "Tuesday"}, { id: 803, text: "Wednesday"}, { id: 804, text: "Thursday"}, { id: 805, text: "Friday"}, { id: 806, text: "Saturday"}, { id: 807, text: "Sunday"}
    ],
    userAnswer: {}
  },
  {
    id: 9,
    question: "What is you desired finish time time?",
    userAnswerType: "number-time",
    userAnswer: {}
  },

]


// localStorage.clear() to update questions in browser

const QUESTIONS_VERSION = "v3";

export function QuestionsProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem("questions_" + QUESTIONS_VERSION);
    if (saved) {
      const parsed: Question[] = JSON.parse(saved);


      return parsed.map((q) => ({
        ...q,
        userAnswer: {
          ...q.userAnswer,
          dateResponse: q.userAnswer.dateResponse 
            ? new Date(q.userAnswer.dateResponse) 
            : undefined,
        },
      }));
    }
    return initialQuestions;
  });

  useEffect(() => {
    localStorage.setItem("questions_" + QUESTIONS_VERSION, JSON.stringify(questions));
  }, [questions]);

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
}
