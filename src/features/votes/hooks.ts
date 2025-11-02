import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVotes, voteQuestion } from "./services";

import { VoteStats } from "@/types/vote";

// Hook to get the vote stats of a question post
export const useVotes = (questionId: string, initialVotes?: VoteStats) => {
  return useQuery({
    queryKey: ["votes", questionId],
    queryFn: () => getVotes(questionId),
    initialData: initialVotes,
  });
};

// Hook to vote a question
export const useCreateVote = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, type }: { userId: string; type: "UP" | "DOWN" }) =>
      voteQuestion(questionId, userId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", questionId] });
    },
  });
};
