import CommentButton from "@/features/comments/components/CommentButton";
import VoteButtons from "@/features/votes/components/VoteButtons";
import { VoteStats } from "@/types/vote";
import { MessageSquare, Award, Share2 } from "lucide-react";

type EngagementBarProps = {
  initialVotes: VoteStats;
  questionId: string;
  commentCount: number;
};

const EngagementBar = ({
  initialVotes,
  questionId,
  commentCount,
}: EngagementBarProps) => {
  return (
    <div className="flex items-center gap-8">
      <VoteButtons initialVotes={initialVotes} questionId={questionId} />

      <CommentButton
        initialCommentCount={commentCount}
        questionId={questionId}
      />
    </div>
  );
};

export default EngagementBar;
