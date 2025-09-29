"use client";

import React from "react";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2 } from "lucide-react";
import { FeedQuestion } from "@/types/question";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteQuestion } from "@/lib/services/questions";

interface QuestionCardProps {
  question: FeedQuestion;
  userId: string;
}

const QuestionCard = ({ question, userId }: QuestionCardProps) => {
  const queryClient = useQueryClient();

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
    <article className="py-4 px-2 border-b space-y-2">
      <header className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Image
            src={question.author.image || "/default-avatar.png"}
            alt={question.author.name}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{question.author.name}</span>
            <span className="text-muted-foreground text-xs">
              {timeAgo(question.createdAt)}
            </span>
          </div>
        </div>
        <button className="font-medium text-sm px-2 py-1 rounded hover:bg-gray-100">
          Join
        </button>
      </header>

      <h2 className="font-semibold text-lg">{question.title}</h2>

      {question.description && (
        <p className="text-sm text-muted-foreground">
          {question.description.length > 100
            ? question.description.slice(0, 100) + "..."
            : question.description}
        </p>
      )}

      {question.image && (
        <Image
          src={question.image}
          alt={question.title}
          width={800}
          height={400}
          className="w-full my-4 h-full  object-cover rounded-sm"
          priority
        />
      )}

      <footer className="flex  items-center space-x-6 text-sm">
        <button
          onClick={() => handleVote("UP")}
          className="flex items-center space-x-1 cursor-pointer  hover:text-red-400"
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

export default QuestionCard;
