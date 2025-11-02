import { FeedQuestion } from "./question";

export type CommunityRole = "ADMIN" | "MODERATOR" | "MEMBER";

export type Community = {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string | null;
  banner?: string | null;
  createdAt: Date;
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
  totalQuestions: number;
  admins: {
    id: string;
    name: string;
    username: string | null;
    email: string;
    image: string | null;
  }[];
};

export type CommunityPreview = {
  id: string;
  name: string;
  avatar: string | null;
};
