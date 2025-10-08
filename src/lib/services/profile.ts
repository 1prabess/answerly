import axios from "axios";

// Get user profile
export const getProfile = async (
  username: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axios.get(
    `/api/profile?username=${username}&page=${page}&limit=${limit}`,
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || "Profile not found");
  }

  return response.data.data;
};

// Follow an user profile
export const followUser = async (
  currentUserId: string,
  userToFollowId: string,
) => {
  const response = await axios.post("/api/follow", {
    followerId: currentUserId,
    followingId: userToFollowId,
  });

  return response.data.data;
};
