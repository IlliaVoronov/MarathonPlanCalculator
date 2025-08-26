import React, { createContext, type SetStateAction } from "react"
import type { Question } from "./QuestionsProvider";


interface QuestionsContextType {
  questions: Question[];
  setQuestions: React.Dispatch<SetStateAction<Question[]>>;
}

export const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

