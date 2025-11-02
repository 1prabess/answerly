"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import { FeedQuestion, QuestionDetails } from "@/types/question";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteQuestion } from "../hooks";
import { CommunityPreview } from "@/types/community";

type QuestionHeaderProps = {
  question: QuestionDetails | FeedQuestion;
  variant: "small" | "large";
  communityName?: string;
  communityPreview?: CommunityPreview;
};

export const QuestionHeader = ({
  question,
  variant,
  communityName,
  communityPreview,
}: QuestionHeaderProps) => {
  const { data: session, isPending } = authClient.useSession();
  const { mutate: deleteQuestion } = useDeleteQuestion(communityName);

  const userId = session?.user.id;

  if (!isPending && !session) return null;

  const avatarSize = variant === "small" ? 32 : 48;
  const avatarClass =
    variant === "small" ? "w-8 h-8 text-xs" : "w-12 h-12 text-sm";
  const titleClass =
    variant === "small" ? "text-xl font-bold" : "text-2xl font-bold";
  const tagClass =
    variant === "small" ? "text-xs px-2 py-1" : "text-xs sm:text-sm px-3 py-1";

  const handleDeleteQuestion = () => {
    deleteQuestion(question.id);
  };

  return (
    <div className="space-y-2">
      {/* Top row: author info + community + menu */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Author info */}
        <Link href={`/profile/${question.author?.username}`}>
          <div className="flex cursor-pointer items-center gap-2">
            {question.author?.image ? (
              <Image
                src={question.author.image}
                alt={question.author.name || "Author"}
                width={avatarSize}
                height={avatarSize}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className={`flex items-center justify-center bg-gray-300 font-semibold text-gray-700 ${avatarClass}`}
              >
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
              <span className="leading-tight font-semibold">
                {question.author?.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {question.createdAt ? timeAgo(question.createdAt) : ""}
              </span>
            </div>
          </div>
        </Link>

        {/* Right: community + dropdown */}
        <div className="flex items-center gap-2">
          {communityPreview && (
            <Link
              href={`/communities/${communityPreview.name}`}
              className="bg-muted flex items-center gap-2 rounded-full p-2 transition"
            >
              {communityPreview.avatar && (
                <div className="relative h-[18px] w-[18px] overflow-hidden rounded-full">
                  <Image
                    src={communityPreview.avatar}
                    alt={communityPreview.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                a/{communityPreview.name}
              </span>
            </Link>
          )}

          {/* Dropdown */}
          {question.authorId === userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  ⋮
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36 text-sm">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteQuestion}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Title */}
      {variant === "small" ? (
        <Link href={`/question/${question.id}`}>
          <h1 className={cn("cursor-pointer", titleClass)}>{question.title}</h1>
        </Link>
      ) : (
        <h1 className={cn(titleClass, "my-4")}>{question.title}</h1>
      )}

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag.name}
              className={cn(
                "rounded-full bg-gray-100 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                tagClass,
              )}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
