export interface Question {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string | null;
}

export interface FeedQuestion {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string | null;
  author: {
    id: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    username: string | null;
    email: string;
    emailVerified: boolean;
  } | null;
  upVotes: number;
  downVotes: number;
  score: number;
  userVoted: "UP" | "DOWN" | null;
  tags: {
    categoryId: string | null;
    id: string;
    name: string;
  }[];
}
