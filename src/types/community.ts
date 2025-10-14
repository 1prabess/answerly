import { FeedQuestion } from "./question";

export type CommunityRole = "ADMIN" | "MODERATOR" | "MEMBER";

export type Community = {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string | null;
  banner?: string | null;
};

export type CommunityMember = {
  id: string;
  userId: string;
  communityId: string;
  role: CommunityRole;
  joinedAt: string;
};

export type CommunityDetails = Community & {
  memberCount: number;
  joined: boolean;
  questions: FeedQuestion[];
};
