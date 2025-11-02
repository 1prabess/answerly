import { config } from "@/config";
import { CreateQuestionType } from "@/lib/zod/questionSchema";
import { ApiResponse } from "@/types/api";
import { FeedQuestion, Question, QuestionDetails } from "@/types/question";
import axios from "axios";

// Gets a single question by Id
export const getQuestion = async (questionId: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/questions/${questionId}`,
  );

  const data: ApiResponse<QuestionDetails> = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch question.");
  }

  return data.data;
};

// Gets questions from all users
export const getQuestions = async () => {
  const response = await fetch(`${config.NEXT_PUBLIC_BASE_URL}/api/questions`);

  const data: ApiResponse<FeedQuestion[]> = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch questions.");
  }

  return data.data;
};

// Create question
export const createQuestion = async (payload: CreateQuestionType) => {
  const response = await axios.post(`/api/questions`, payload);

  return response.data.data;
};

// Create community question
export const createCommunityQuestion = async (
  communityName: string,
  payload: CreateQuestionType,
) => {
  const response = await fetch(`/api/communities/${communityName}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<Question> = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create question");
  }

  return data.data;
};

// Gets questions from a particular community
export const getCommunityQuestions = async (communityName: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities/${communityName}/questions`,
  );

  const data: ApiResponse<FeedQuestion[]> = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch community questions.");
  }

  return data.data;
};

// Deletes a question
export const deleteQuestion = async (questionId: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/questions/${questionId}`,
    {
      method: "DELETE",
    },
  );

  const data: ApiResponse<never> = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete question.");
  }

  return data.message;
};
