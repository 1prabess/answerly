import { VoteStats } from "@/types/vote";
import axios from "axios";

export const getVotes = async (questionId: string) => {
  const response = await axios.get(`/api/vote/${questionId}`);
  const votes: VoteStats = response.data.data;
  return votes;
};
