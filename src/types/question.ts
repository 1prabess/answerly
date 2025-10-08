export type Question = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string | null;
};

export type FeedQuestion = Question & {
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
};

export type QuestionDetails = Question & {
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
};
