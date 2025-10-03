import { FeedQuestion } from "@/types/question";
import axios from "axios";
import { CreateQuestionType } from "../zod/questionSchema";

export const getQuestions = async () => {
  const response = await axios.get("/api/questions");

  const questions: FeedQuestion[] = response.data.data;

  return questions;
};

export const voteQuestion = async (
  questionId: string,
  userId: string,
  type: "UP" | "DOWN"
) => {
  const response = await axios.post(`/api/questions/${questionId}`, {
    userId,
    type,
  });

  return response.data.data;
};

export const createQuestion = async (payload: CreateQuestionType) => {
  const response = await axios.post(`/api/questions`, payload);

  return response.data.data;
};

// Categories
export const fetchCategories = async () => {
  const response = await axios.get("/api/categories");
  return response.data.data;
};

// Tags by Category
export const fetchTagsByCategory = async (categoryId: string) => {
  console.log(categoryId);
  const response = await axios.get(`/api/categories/${categoryId}`);
  return response.data.data;
};
