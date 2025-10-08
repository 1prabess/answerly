export type Comment = {
  userId: string;
  id: string;
  content: string;
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
  replyToId: string | null;
};

export type CommentWithUser = Comment & {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};
