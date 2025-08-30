import { useState, type ReactNode } from "react";
import { QuestionsContext } from "./QuestionsContext";


interface AnswerOption {
  id: number;
  text: string;
}

export type AnswerType = "multiple-choice" | "number" | "date" | "one-choice";

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
    question: "Have you done running before?",
    userAnswerType: "one-choice",
    answerOptions: [
      { id: 401, text: "No"}, { id: 402, text: "Yes, less then 10km"}, { id: 403, text: "Yes, more then 10km"}, { id: 404, text: "Yes, Half a Marathon"}, { id: 405, text: "Yes, a Full-Marathon"}
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

]

export function QuestionsProvider({ children }: { children: ReactNode }) {
  
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionsContext.Provider>
  )
}