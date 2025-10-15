"use client";

import CommentCard from "./CommentCard";

import { useComments } from "../hooks";
import { CommentWithUser } from "@/types/comment";
import { CommentWithReplies } from "../types";

type CommentSectionProps = { questionId: string };

const buildCommentTree = (
  comments: CommentWithUser[],
): CommentWithReplies[] => {
  const map: Record<string, CommentWithReplies> = {};
  const roots: CommentWithReplies[] = [];

  comments.forEach((c) => (map[c.id] = { ...c, replies: [] }));

  comments.forEach((c) => {
    if (c.replyToId && map[c.replyToId] && !map[c.replyToId].replyToId) {
      map[c.replyToId].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
};

const CommentSection = ({ questionId }: CommentSectionProps) => {
  const { data: comments, isPending, isError } = useComments(questionId);

  if (isPending) {
    return (
      <p className="text-muted-foreground py-6 text-center text-base">
        Loading comments...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive py-6 text-center text-base">
        Failed to load comments.
      </p>
    );
  }

  const nestedComments = comments ? buildCommentTree(comments) : [];

  if (nestedComments.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-base">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="max-w-full">
      {nestedComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          questionId={questionId}
        />
      ))}
    </div>
  );
};

export default CommentSection;
