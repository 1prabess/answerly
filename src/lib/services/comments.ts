import { ApiResponse } from "@/types/api";
import axios from "axios";

export const createComment = async (questionId: string, content: string) => {
  const response = await axios.post<ApiResponse<Comment>>("/api/comment", {
    questionId,
    content,
  });

  return response.data.message;
};

export const getComments = async (questionId: string) => {
  const response = await axios.get(`/api/comment/${questionId}`);

  return response.data.data;
};
