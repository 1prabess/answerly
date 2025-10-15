import { config } from "@/config";

// Get profile of a user (own + others)
export const getProfile = async (
  username: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/profile?username=${username}&page=${page}&limit=${limit}`,
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404)
      return { data: null, error: "No profile found." };

    return { data: null, error: "Failed to fetch profile." };
  }

  return { data: data.data, error: null };
};

// Follows a user
export const followUser = async (
  currentUserId: string,
  userToFollowId: string,
) => {
  const response = await fetch(`${config.NEXT_PUBLIC_BASE_URL}/api/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followerId: currentUserId,
      followingId: userToFollowId,
    }),
  });

  if (!response.ok) {
    if (response.status === 404)
      return { data: null, error: "No user found to follow." };

    return { data: null, error: "Failed to follow user." };
  }

  return { data: true, error: null };
};
