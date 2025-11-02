import { FeedQuestion, QuestionDetails } from "@/types/question";
import axios from "axios";
import { CreateQuestionType } from "../zod/questionSchema";
import { ApiResponse } from "@/types/api";

// Get questions
export const getQuestions = async () => {
  const response = await axios.get("http://localhost:3000/api/questions");

  const questions: FeedQuestion[] = response.data.data;

  return questions;
};

// Get question by id
export const getQuestion = async (questionId: string) => {
  const response = await axios.get<ApiResponse<QuestionDetails>>(
    `/api/questions/${questionId}`,
  );

  if (!response.data.success || !response.data.data) return null;

  return response.data.data;
};

// Vote a question
export const voteQuestion = async (
  questionId: string,
  userId: string,
  type: "UP" | "DOWN",
) => {
  const response = await axios.post(`/api/questions/${questionId}`, {
    userId,
    type,
  });

  return response.data.data;
};

// Create question
export const createQuestion = async (payload: CreateQuestionType) => {
  const response = await axios.post(`/api/questions`, payload);

  return response.data.data;
};

// Get categories
export const fetchCategories = async () => {
  const response = await axios.get("/api/categories");
  return response.data.data;
};

// Get tags according to the category
export const fetchTagsByCategory = async (categoryId: string) => {
  console.log(categoryId);
  const response = await axios.get(`/api/categories/${categoryId}`);
  return response.data.data;
};
