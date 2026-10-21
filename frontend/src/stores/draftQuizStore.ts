import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { QuestionCreate, QuizCreate } from "@/client";

export type DraftQuestion = QuestionCreate & {
  id: string;
  edited: boolean;
};

type DraftQuiz = Omit<QuizCreate, "questions"> & {
  questions: DraftQuestion[];
  savedQuizId: number | null;
};

type DraftQuizState = {
  draftQuiz: DraftQuiz | null;
  editingQuestionId: string | null;
  startDraft: (quiz: QuizCreate, savedQuizId?: number) => void;
  replaceQuestion: (questionId: string, question: QuestionCreate) => void;
  updateQuestion: (questionId: string, question: QuestionCreate) => void;
  deleteQuestion: (questionId: string) => void;
  restoreQuestion: (question: DraftQuestion, position: number) => void;
  startEditing: (questionId: string) => void;
  stopEditing: () => void;
  clearDraft: () => void;
};

const toDraftQuestion = (question: QuestionCreate): DraftQuestion => {
  return {
    text: question.text,
    options: question.options,
    correct_index: question.correct_index,
    explanation: question.explanation,
    id: crypto.randomUUID(),
    edited: false,
  };
};

export const useDraftQuizStore = create<DraftQuizState>()(
  persist(
    (set) => ({
      draftQuiz: null,
      editingQuestionId: null,

      startDraft: (quiz, savedQuizId) =>
        set({
          draftQuiz: {
            title: quiz.title,
            level: quiz.level,
            subject: quiz.subject,
            topic: quiz.topic,
            language: quiz.language,
            questions: quiz.questions.map(toDraftQuestion),
            savedQuizId: savedQuizId ?? null,
          },
          editingQuestionId: null,
        }),

      replaceQuestion: (questionId, question) =>
        set((state) => {
          if (state.draftQuiz === null) {
            return state;
          }
          const questions = state.draftQuiz.questions.map((current) =>
            current.id === questionId
              ? { ...question, id: current.id, edited: false }
              : current,
          );
          return { draftQuiz: { ...state.draftQuiz, questions } };
        }),

      updateQuestion: (questionId, question) =>
        set((state) => {
          if (state.draftQuiz === null) {
            return state;
          }
          const questions = state.draftQuiz.questions.map((current) =>
            current.id === questionId
              ? { ...question, id: current.id, edited: true }
              : current,
          );
          return { draftQuiz: { ...state.draftQuiz, questions } };
        }),

      deleteQuestion: (questionId) =>
        set((state) => {
          if (state.draftQuiz === null) {
            return state;
          }
          const questions = state.draftQuiz.questions.filter(
            (current) => current.id !== questionId,
          );
          return { draftQuiz: { ...state.draftQuiz, questions } };
        }),

      restoreQuestion: (question, position) =>
        set((state) => {
          if (state.draftQuiz === null) {
            return state;
          }
          const questions = [
            ...state.draftQuiz.questions.slice(0, position),
            question,
            ...state.draftQuiz.questions.slice(position),
          ];
          return { draftQuiz: { ...state.draftQuiz, questions } };
        }),

      startEditing: (questionId) => set({ editingQuestionId: questionId }),

      stopEditing: () => set({ editingQuestionId: null }),

      clearDraft: () => set({ draftQuiz: null, editingQuestionId: null }),
    }),
    {
      name: "quiz-maker-draft",
      partialize: (state) => ({ draftQuiz: state.draftQuiz }),
    },
  ),
);

export const toQuizCreate = (draftQuiz: DraftQuiz): QuizCreate => {
  return {
    title: draftQuiz.title,
    level: draftQuiz.level,
    subject: draftQuiz.subject,
    topic: draftQuiz.topic,
    language: draftQuiz.language,
    questions: draftQuiz.questions.map((question) => ({
      text: question.text,
      options: question.options,
      correct_index: question.correct_index,
      explanation: question.explanation,
    })),
  };
};
