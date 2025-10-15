"use client";

import { FeedQuestion } from "@/types/question";

import QuestionCard from "./QuestionCard";
import EngagementBar from "./EngagementBar";
import { useCommunityQuestions } from "../hooks";

type CommunityQuestionsProps = {
  communityName: string;
  variant: "small" | "large";
  initialQuestions: FeedQuestion[];
};

const CommunityQuestions = ({
  communityName,
  initialQuestions,
  variant,
}: CommunityQuestionsProps) => {
  const { data: questions } = useCommunityQuestions(
    communityName,
    initialQuestions,
  );

  if (!questions) return null;

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id} className="space-y-3 border-b py-3">
          <QuestionCard question={question} variant={variant} />
          <EngagementBar
            initialVotes={{
              upVotes: question.upVotes,
              downVotes: question.downVotes,
              userVote: question.userVoted,
              score: question.score,
            }}
            questionId={question.id}
            commentCount={question.commentCount}
          />
        </div>
      ))}
    </div>
  );
};

export default CommunityQuestions;
