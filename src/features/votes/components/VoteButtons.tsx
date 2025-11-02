"use client";

import { ArrowUp, ArrowDown, MessageSquare, Award, Share2 } from "lucide-react";
import { useCreateVote, useVotes } from "../hooks";
import { authClient } from "@/lib/auth-client";
import { VoteStats } from "@/types/vote";

type VoteButtonsProps = {
  initialVotes: VoteStats;
  questionId: string;
};

const VoteButtons = ({ initialVotes, questionId }: VoteButtonsProps) => {
  const { data, isPending } = useVotes(questionId, initialVotes);
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const { mutate } = useCreateVote(questionId);

  const handleVote = (type: "UP" | "DOWN") => {
    if (!userId) return;
    if (!isPending) {
      mutate({ userId, type });
    }
  };

  // Determine which button the user voted for
  const userVote = data?.userVote;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVote("UP")}
          className={`transition ${
            userVote === "UP"
              ? "font-bold text-blue-500"
              : "hover:text-blue-600"
          }`}
        >
          <ArrowUp size={18} />
        </button>
        <span
          className={`text-sm font-medium transition ${
            userVote === "UP"
              ? "font-bold text-blue-500"
              : "hover:text-blue-600"
          }`}
        >
          {data?.upVotes ?? 0}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVote("DOWN")}
          className={`transition ${
            userVote === "DOWN"
              ? "font-bold text-red-600"
              : "hover:text-red-600"
          }`}
        >
          <ArrowDown size={18} />
        </button>
        <span
          className={`text-sm font-medium transition ${
            userVote === "DOWN"
              ? "font-bold text-red-600"
              : "hover:text-red-600"
          }`}
        >
          {data?.downVotes ?? 0}
        </span>
      </div>
    </div>
  );
};

export default VoteButtons;
