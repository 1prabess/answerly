import { QuestionVoteStats } from "@/types/api";
import axios from "axios";

export const getVotes = async (questionId: string) => {
  const response = await axios.get(`/api/vote/${questionId}`);
  const votes: QuestionVoteStats = response.data.data;
  return votes;
};
