"use client";

import React from "react";
import { MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/lib/services/comments";
import { timeAgo } from "@/lib/utils";

type CommentSectionProps = {
  questionId: string;
};

const CommentSection = ({ questionId }: CommentSectionProps) => {
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", questionId],
    queryFn: () => getComments(questionId),
    enabled: !!questionId,
  });

  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p>Failed to load comments.</p>;

  return (
    <div className="space-y-2">
      {comments?.map((comment: any) => (
        <Card
          key={comment.id}
          className="border-x-0 px-0 bg-transparent border-t-0 border-b py-2 shadow-none"
        >
          <CardContent className="flex px-0 gap-3 items-start">
            {/* Avatar */}
            {comment.user?.image ? (
              <Image
                src={comment.user.image}
                alt={comment.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {comment.user?.name
                  ? comment.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?"}
              </div>
            )}

            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex  text-xs items-center justify-between gap-1 sm:gap-2">
                <span>{comment.user?.name}</span>
                <span>{timeAgo(comment.createdAt)}</span>
              </div>

              <p className="mt-1 text-sm ">{comment.content}</p>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>0</span>
                  <ArrowDown className="w-3 h-3" />
                </div>
                <Button variant="ghost" size="sm" className="px-1">
                  <MessageSquare className="w-3 h-3 mr-1" /> Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommentSection;
