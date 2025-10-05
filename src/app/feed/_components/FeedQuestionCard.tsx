"use client";

import React from "react";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2 } from "lucide-react";
import { FeedQuestion } from "@/types/question";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteQuestion } from "@/lib/services/questions";
import { useRouter } from "next/navigation";

interface FeedQuestionCardProps {
  question: FeedQuestion;
  userId: string;
}

const FeedQuestionCard = ({ question, userId }: FeedQuestionCardProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      questionId,
      userId,
      type,
    }: {
      questionId: string;
      userId: string;
      type: "UP" | "DOWN";
    }) => voteQuestion(questionId, userId, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  const handleVote = (type: "UP" | "DOWN") => {
    if (!isPending) mutate({ questionId: question.id, userId, type });
  };

  return (
    <article className="py-4 px-2 border-b space-y-4">
      <div onClick={() => router.push(`/question/${question.id}`)}>
        {/* Header */}
        <header className="flex justify-between items-center mb-2  text-sm">
          <div
            onClick={() => router.push(`/profile/${question.author?.username}`)}
            className="flex items-center gap-2"
          >
            {question.author?.image ? (
              <Image
                src={question.author.image}
                alt={question.author.name || "author name"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                {question.author?.name
                  ? question.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?"}
              </div>
            )}

            <div className="flex flex-col">
              <span className="font-semibold">{question.author?.name}</span>
              <span className="text-muted-foreground text-xs">
                {timeAgo(question.createdAt)}
              </span>
            </div>
          </div>
          <button className="font-medium text-sm px-2 py-1 rounded hover:bg-gray-100">
            Join
          </button>
        </header>

        {/* Title */}
        <h2 className="font-semibold text-lg">{question.title}</h2>

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {question.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {question.description.length > 300
              ? question.description.slice(0, 300) + "..."
              : question.description}
          </p>
        )}

        {/* Image */}
        {question.image && (
          <Image
            src={question.image}
            alt={question.title}
            width={800}
            height={400}
            className="w-full max-h-[30rem] mt-2 object-contain rounded-md"
            priority
          />
        )}
      </div>

      {/* Footer */}
      <footer className="flex items-center space-x-6 text-sm">
        <button
          onClick={() => handleVote("UP")}
          className="flex items-center space-x-1 cursor-pointer hover:text-red-400"
        >
          {question.userVoted === "UP" ? (
            <ArrowBigUp size={18} className="text-red-400 fill-red-400" />
          ) : (
            <ArrowBigUp size={18} />
          )}
          <span>{question.upVotes}</span>
        </button>
        <button
          onClick={() => handleVote("DOWN")}
          className="flex items-center space-x-1 cursor-pointer hover:text-gray-400"
        >
          {question.userVoted === "DOWN" ? (
            <ArrowBigDown size={18} className="text-gray-400 fill-gray-400" />
          ) : (
            <ArrowBigDown size={18} />
          )}
          <span>{question.downVotes}</span>
        </button>
        <div className="flex items-center space-x-1">
          <MessageCircle size={18} />
          <span>3</span>
        </div>
        <div className="flex items-center space-x-1">
          <Share2 size={18} />
          <span>Share</span>
        </div>
      </footer>
    </article>
  );
};

export default FeedQuestionCard;
