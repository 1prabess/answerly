import { config } from "@/config";
import { ApiResponse } from "@/types/api";
import { VoteStats } from "@/types/vote";
import axios from "axios";

// Get vote stats of a question
export const getVotes = async (questionId: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/vote/${questionId}`,
  );

  const data: ApiResponse<VoteStats> = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get votes.");
  }

  return data.data;
};

// Vote a question
export const voteQuestion = async (
  questionId: string,
  userId: string,
  type: "UP" | "DOWN",
) => {
  const response = await axios.post(`/api/vote/${questionId}`, {
    userId,
    type,
  });

  return response.data.data;
};
