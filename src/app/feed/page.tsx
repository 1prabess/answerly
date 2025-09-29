"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getQuestions } from "@/lib/services/questions";
import QuestionCard from "./_components/QuestionCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import AskBox from "./_components/AskBox";
import ScrollableNewsFeed from "./_components/NewsCard";
import FeedSkeleton from "./_components/FeedSkeleton";
import QuestionFormModal from "./_components/QuestionFormModal";

const Feed = () => {
  const router = useRouter();

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    data: questions = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isSessionLoading || isPending) {
    return (
      <div>
        <FeedSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load questions. Please try again.
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center ">
        <div className="w-full max-w-md p-4">
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-muted-foreground">
              No questions found
            </h2>
            <p className="text-sm text-muted-foreground">
              Be the first to ask a question!
            </p>
            <Button
              variant="link"
              onClick={() => setIsModalOpen(true)}
              className="mt-2"
            >
              Ask a Question
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <QuestionFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-muted-foreground font-semibold mb-2">
        Recommended Communities
      </h1>
      <ScrollableNewsFeed />
      <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-12 mt-2">
        <div>
          <AskBox
            name={session?.user.name || ""}
            avatar={session?.user.image || ""}
          />
          <div role="list" aria-label="Question feed">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                userId={session?.user.id!}
              />
            ))}
          </div>
        </div>
        <aside className="hidden lg:block ">
          <div className="sticky top-20 ">
            <div className="border rounded-lg p-4">Right Column</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Feed;
