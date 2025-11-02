"use client";

import { FeedQuestion } from "@/types/question";
import { useQuestions } from "../hooks";
import QuestionCard from "./QuestionCard";
import EngagementBar from "./EngagementBar";

type QuestionsProps = {
  variant: "small" | "large";
  initialQuestions: FeedQuestion[];
};

const Questions = ({ initialQuestions, variant }: QuestionsProps) => {
  const { data: questions } = useQuestions(initialQuestions);

  if (!questions) return null;

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id} className="space-y-3 border-b py-5">
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

export default Questions;
