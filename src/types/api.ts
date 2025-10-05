export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string | string[];
  data?: T;
}

export interface QuestionWithAuthorAndTags {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  image: string | null;
  authorId: string | null;
  author: {
    name: string;
    username: string | null;
    image: string | null;
  } | null;
  tags: { name: string }[] | null;
}

export interface QuestionDetails {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  image: string | null;
  authorId: string | null;
  author: {
    name: string;
    username: string | null;
    image: string | null;
  } | null;
  tags: { name: string }[] | null;
  upVotes: number;
  downVotes: number;
  score: number;
  userVote: "UP" | "DOWN" | null;
}

export interface QuestionVoteStats {
  upVotes: number;
  downVotes: number;
  score: number;
  userVote: "UP" | "DOWN" | null;
}
