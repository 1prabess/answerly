import { getQuestions } from "@/features/questions/services";
import RecommendedQuestions from "./_components/RecommendedQuestions";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EngagementBar from "@/features/questions/components/EngagementBar";
import Questions from "@/features/questions/components/Questions";

const FeedPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  let questions = null;
  let error = null;

  try {
    questions = await getQuestions();
  } catch (error) {
    error = error instanceof Error ? error.message : "Something went wrong..";
  }

  if (!session) redirect("/login");

  const hasUsername = !!session.user.username;

  if (!hasUsername) redirect("/set-username");

  if (error || !questions) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-muted-foreground mb-2 font-semibold">
        Recommended Communities
      </h1>
      <RecommendedQuestions />
      <div className="mt-2 lg:grid lg:grid-cols-[2fr_1fr] lg:gap-12">
        <div>
          {/* <AskQuestionBox
            name={session?.user.name || ""}
            avatar={session?.user.image || ""}
          /> */}
          <div role="list" aria-label="Question feed">
            {/* {questions.map((question) => (
              <div key={question.id} className="space-y-3 border-b py-3">
                <QuestionCard question={question} variant="small" />
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
            ))} */}
            <Questions initialQuestions={questions} variant="small" />
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <div className="rounded-lg border p-4">Right Column</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
