import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getCommentCount, getComments } from "./services";

// Hook to get comments
export const useComments = (questionId: string) => {
  return useQuery({
    queryKey: ["comments", questionId],
    queryFn: () => getComments(questionId),
  });
};

// Hook to create comment
export const useCreateComment = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newContent: string) => createComment(questionId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", questionId] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["commentCount", questionId] });
    },
    onError: (error) => {
      console.log("Failed to post comment:", error.message);
    },
  });
};

// Hook to reply a comment
export const useReplyComment = (
  questionId: string,
  parentCommentId: string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newContent: string) =>
      createComment(questionId, newContent, parentCommentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", questionId] });
      queryClient.invalidateQueries({ queryKey: ["commentCount", questionId] });
    },
  });
};

// Hook to get comment count
export const useCommentCount = (
  questionId: string,
  initialCommentCount: number,
) => {
  return useQuery({
    queryKey: ["commentCount", questionId],
    queryFn: () => getCommentCount(questionId),
    initialData: initialCommentCount,
  });
};
