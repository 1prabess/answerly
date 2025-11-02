import { FeedQuestion, QuestionDetails } from "@/types/question";
import Link from "next/link";

type QuestionDescriptionProps = {
  question: QuestionDetails | FeedQuestion;
  variant: "small" | "large";
};

export const QuestionDescription = ({
  question,
  variant,
}: QuestionDescriptionProps) => {
  if (!question.description) return null;

  const description =
    variant === "small" && question.description.length > 150
      ? question.description.slice(0, 150) + "..."
      : question.description;

  return (
    <div
      className={`prose text-gray-700 dark:text-gray-300 ${
        variant === "small" ? "prose-sm sm:prose" : "text-base"
      }`}
    >
      {variant === "small" ? (
        <Link href={`/question/${question.id}`}>
          <p className="cursor-pointer text-sm">{description}</p>
        </Link>
      ) : (
        <p>{description}</p>
      )}
    </div>
  );
};
