import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createCommunity, getCommunity, joinCommunity } from "./services";
import { CommunityDetails } from "@/types/community";
import { FeedQuestion } from "@/types/question";
import { getCommunityQuestions } from "../questions/services";

// Hook to create a new community
export const useCreateCommunity = () => {
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      avatar?: string;
      banner?: string;
    }) =>
      createCommunity(data.name, data.description, data.avatar, data.banner),
  });
};

// Hook to join a community
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityName: string) => joinCommunity(communityName),
    onSuccess: (_data, communityName) =>
      queryClient.invalidateQueries({ queryKey: ["community", communityName] }),
  });
};

// Hook to get a community
export const useGetCommunity = (
  communityName: string,
  initialData?: CommunityDetails,
) => {
  return useQuery({
    queryKey: ["community", communityName],
    queryFn: () => getCommunity(communityName),
    initialData,
  });
};
