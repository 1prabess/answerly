import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { followUser, getProfile } from "./services";
import { UserProfile } from "./types";

// Hook to get a profile
export const useProfile = (
  username?: string | null,
  profileData?: UserProfile,
) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username!, 1, 10),
    initialData: profileData ? { data: profileData, error: null } : undefined,
    enabled: !!username,
  });
};

// Hook to follow user
export const useFollowProfile = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      currentUserId,
      userToFollowId,
    }: {
      currentUserId: string;
      userToFollowId: string;
    }) => followUser(currentUserId, userToFollowId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["profile", username] }),
  });
};
