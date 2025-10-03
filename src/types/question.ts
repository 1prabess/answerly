export interface FeedQuestion {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string | null;
  author: {
    name: string;
    image?: string | null;
  };
  upVotes: number;
  downVotes: number;
  score: number;
  userVoted: "UP" | "DOWN" | null;
  tags: {
    categoryId: string;
    id: string;
    name: string;
  }[];
}
