import React from "react";
import Image from "next/image";

import { FeedQuestion, QuestionDetails } from "@/types/question";
import Link from "next/link";

type QuestionImageProps = {
  question: QuestionDetails | FeedQuestion;
  variant: "small" | "large";
};

export const QuestionImage = ({ question, variant }: QuestionImageProps) => {
  if (!question.image) return null;

  const width = variant === "small" ? 400 : 800;
  const height = variant === "small" ? 200 : 400;

  return (
    <div className="w-full overflow-hidden">
      {variant === "small" ? (
        <Link href={`/question/${question.id}`}>
          <Image
            src={question.image}
            alt={question.title}
            width={width}
            height={height}
            className="h-auto w-full cursor-pointer object-contain"
            priority
          />
        </Link>
      ) : (
        <Image
          src={question.image}
          alt={question.title}
          width={width}
          height={height}
          className="h-auto w-full object-contain"
          priority
        />
      )}
    </div>
  );
};
