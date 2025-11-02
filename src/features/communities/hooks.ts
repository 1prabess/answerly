import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCommunity,
  deleteCommunityMember,
  getCommunity,
  getCommunityMembers,
  joinCommunity,
  updateCommunityMember,
} from "./services";
import { CommunityDetails } from "@/types/community";
import {
  DeleteCommunityMemberPayload,
  UpdateCommunityMemberPayload,
} from "./types";

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

// Hook to get community members
export const useGetCommunityMembers = (communityName: string) => {
  return useQuery({
    queryKey: ["communityMembers", communityName],
    queryFn: () => getCommunityMembers(communityName),
  });
};

// Hook to update role of a community member
export const useUpdateCommunityMember = (communityName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCommunityMemberPayload) =>
      updateCommunityMember(communityName, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityMembers", communityName],
      });
    },
  });
};

// Hook to delete a community member
export const useDeleteCommunityMember = (communityName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteCommunityMemberPayload) =>
      deleteCommunityMember(communityName, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityMembers", communityName],
      });
      queryClient.invalidateQueries({ queryKey: ["community", communityName] });
    },
  });
};
