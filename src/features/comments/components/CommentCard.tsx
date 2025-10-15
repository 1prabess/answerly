"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

import CommentReplyInput from "./CommentReplyInput";
import { CommentWithReplies } from "../types";

type CommentCardProps = {
  comment: CommentWithReplies;
  questionId: string;
  isReply?: boolean;
};

const CommentCard = ({
  comment,
  questionId,
  isReply = false,
}: CommentCardProps) => {
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const initials =
    comment.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <div className={cn("flex gap-3", isReply ? "pt-4" : "border-b py-4")}>
      {/* Avatar */}
      {comment.user.image ? (
        <Image
          src={comment.user.image}
          alt={comment.user.name || "User"}
          width={36}
          height={36}
          className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="bg-muted text-muted-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {initials}
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {comment.user.name || "Anonymous"}
          </span>
          <span className="text-muted-foreground text-sm">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        <p className="text-foreground/80 mt-1 text-[15px] leading-relaxed break-words">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <ArrowUp className="hover:text-primary h-4 w-4 cursor-pointer transition" />
            <span>0</span>
            <ArrowDown className="hover:text-primary h-4 w-4 cursor-pointer transition" />
          </div>

          {!isReply && (
            <button
              onClick={() => setReplying((prev) => !prev)}
              className="hover:text-primary flex items-center gap-1 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Reply
            </button>
          )}

          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies((prev) => !prev)}
              className="hover:text-primary transition"
            >
              {showReplies
                ? `Hide Replies (${comment.replies.length})`
                : `View Replies (${comment.replies.length})`}
            </button>
          )}
        </div>

        {/* Reply Input */}
        {replying && !isReply && (
          <div className="mt-2">
            <CommentReplyInput
              questionId={questionId}
              parentCommentId={comment.id}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {/* Replies */}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                questionId={questionId}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
