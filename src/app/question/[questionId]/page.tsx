"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getQuestion } from "@/lib/services/questions";
import { timeAgo } from "@/lib/utils";

import BackButton from "@/components/common/BackButton";
import Vote from "../_components/Vote";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CommentInput from "../_components/CommentInput";
import CommentSection from "../_components/CommentSection";

const QuestionDetailPage = () => {
  const { questionId } = useParams();

  if (!questionId) return null;

  if (!questionId || Array.isArray(questionId)) return null;

  const {
    data: question,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [questionId]);

  if (isPending) return <p>Loading....</p>;

  if (isError) return <p>Something went rong</p>;

  const voteStats = {
    upVotes: question?.upVotes ?? 0,
    downVotes: question?.downVotes ?? 0,
    score: question?.score ?? 0,
    userVote: question?.userVote ?? null,
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-12">
        {/* Main Content */}
        <div className="space-y-3">
          {/* Header */}
          <BackButton />
          <div className="flex justify-between items-center">
            <div className="flex  sm:items-center gap-3 sm:gap-4 mt-2">
              {question?.author?.image ? (
                <Image
                  src={question.author.image}
                  alt={question.author.name || "author name"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                  {question?.author?.name
                    ? question.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "?"}
                </div>
              )}
              <div>
                <p className="font-bold ">{question?.author?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(question?.createdAt!)}
                </p>
              </div>
            </div>
            {/* <Button size="sm">Follow</Button> */}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl  font-bold mt-2">
            {question?.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 ">
            {question?.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="text-muted-foreground text-sm  space-y-3 mt-2">
            <p>{question?.description}</p>
          </div>

          {/* Image */}
          {question?.image && (
            <div className="w-full overflow-hidden rounded-md mt-2">
              <Image
                src={question.image}
                alt={question.title}
                width={800}
                height={400}
                className="w-full max-h-[30rem] object-contain rounded-md"
                priority
              />
            </div>
          )}

          {/* Votes */}
          <Vote voteStats={voteStats} questionId={questionId} />

          {/* Comment Input */}
          <div className="my-6">
            <CommentInput questionId={questionId} />
          </div>

          {/* Comments */}
          <CommentSection questionId={questionId} />
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <div className="border rounded-lg p-4">Right Column</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
