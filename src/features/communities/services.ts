import { config } from "@/config";
import { ApiResponse } from "@/types/api";
import { Community, CommunityDetails } from "@/types/community";
import {
  DeleteCommunityMemberPayload,
  UpdateCommunityMemberPayload,
} from "./types";

// Creates a community
export const createCommunity = async (
  name: string,
  description?: string,
  avatar?: string,
  banner?: string,
) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        avatar,
        banner,
      }),
    },
  );

  const data: ApiResponse<Community> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to create community.");
  }

  return data.data;
};

// Gets a community
export const getCommunity = async (communityName: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities/${communityName}`,
  );

  const data: ApiResponse<CommunityDetails> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to get community.");
  }

  return data.data;
};

// Joins a community
export const joinCommunity = async (communityName: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities/${communityName}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to join the  community.");
  }

  return data.data;
};

// Get community members
export const getCommunityMembers = async (communityName: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities/${communityName}/members`,
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to get community members.");
  }

  return data.data;
};

// Update role of a member
export const updateCommunityMember = async (
  communityName: string,
  payload: UpdateCommunityMemberPayload,
) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities/${communityName}/members`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to update member role.");
  }

  return data.data;
};

// Delete a member from community
export const deleteCommunityMember = async (
  communityName: string,
  payload: DeleteCommunityMemberPayload,
) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/communities/${communityName}/members`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to delete community member.");
  }

  return data.data;
};
