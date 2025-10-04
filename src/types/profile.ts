import { FeedQuestion } from "./question";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  questions: FeedQuestion[];
  following: string[];
  followers: string[];
  page: number;
  limit: number;
  totalQuestions: number;
}
