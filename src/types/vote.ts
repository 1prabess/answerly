export type Vote = {
  userId: string;
  questionId: string;
  type: "UP" | "DOWN";
  id: string;
  createdAt: Date;
};

export type VoteStats = {
  upVotes: number;
  downVotes: number;
  score: number;
  userVote: "UP" | "DOWN" | null;
};
