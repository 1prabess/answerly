import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCommunityQuestion,
  createQuestion,
  deleteQuestion,
  getCommunityQuestions,
  getQuestion,
  getQuestions,
} from "./services";
import { CreateQuestionType } from "@/lib/zod/questionSchema";
import { FeedQuestion } from "@/types/question";

// Hook to get questions
export const useQuestions = (initialData: FeedQuestion[]) => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
    initialData,
  });
};

// Hook to get question by Id
export const useQuestion = (questionId: string) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });
};

// Hook to create question
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateQuestionType) => createQuestion(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

// Hook to create community question
export const useCreateCommunityQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communityName,
      payload,
    }: {
      communityName: string;
      payload: CreateQuestionType;
    }) => createCommunityQuestion(communityName, payload),

    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["communityQuestions", variables.communityName],
      });
      queryClient.invalidateQueries({
        queryKey: ["community"],
      });
    },
  });
};

// Hook to get community questions
export const useCommunityQuestions = (
  communityName: string,
  initialData?: FeedQuestion[],
) => {
  return useQuery({
    queryKey: ["communityQuestions", communityName],
    queryFn: () => getCommunityQuestions(communityName),
    initialData,
  });
};

// Hook to delete a question
export const useDeleteQuestion = (communityName?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: (_data, questionId) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });

      if (communityName) {
        queryClient.invalidateQueries({
          queryKey: ["communityQuestions", communityName],
        });
        queryClient.invalidateQueries({
          queryKey: ["community", communityName],
        });
      }
    },
  });
};
