export interface Vote {
  userId: string;
  questionId: string;
  type: "UP" | "DOWN";
  id: string;
  createdAt: Date;
}
