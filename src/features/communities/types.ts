import { CommunityRole } from "@/types/community";

export type UpdateCommunityMemberPayload = {
  targetUserId: string;
  newRole: CommunityRole;
};

export type DeleteCommunityMemberPayload = {
  targetUserId: string;
};
