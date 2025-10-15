"use client";

import { FeedQuestion, QuestionDetails } from "@/types/question";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionDescription } from "./QuestionDescription";
import { QuestionImage } from "./QuestionImage";
import { cn } from "@/lib/utils";

type QuestionCardProps = {
  question: QuestionDetails | FeedQuestion;
  variant: "small" | "large";
};

const QuestionCard = ({ question, variant }: QuestionCardProps) => {
  return (
    <div className={cn("space-y-4")}>
      <QuestionHeader question={question} variant={variant} />
      <QuestionDescription question={question} variant={variant} />
      <QuestionImage question={question} variant={variant} />
    </div>
  );
};

export default QuestionCard;
