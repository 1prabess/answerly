import { config } from "@/config";
import { ApiResponse } from "@/types/api";
import { Comment, CommentWithUser } from "@/types/comment";

// Create a new comment or reply
export const createComment = async (
  questionId: string,
  content: string,
  replyToId?: string,
) => {
  const response = await fetch(`${config.NEXT_PUBLIC_BASE_URL}/api/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questionId,
      content,
      replyToId,
    }),
  });

  const data: ApiResponse<Comment> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to create comment.");
  }

  return data.data;
};

// Fetch all comments for a specific question
export const getComments = async (questionId: string) => {
  const response = await fetch(`/api/comment/${questionId}`);

  const data: ApiResponse<CommentWithUser[]> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to get comments.");
  }

  return data.data;
};

export const getCommentCount = async (questionId: string) => {
  const response = await fetch(`/api/comment/count/${questionId}`);

  const data: ApiResponse<{ commentCount: string }> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to get comment count.");
  }

  return Number(data.data?.commentCount);
};
