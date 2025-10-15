"use client";

import { MessageSquare } from "lucide-react";
import { useCommentCount } from "../hooks";

type CommentButtonProps = {
  initialCommentCount: number;
  questionId: string;
};

const CommentButton = ({
  initialCommentCount,
  questionId,
}: CommentButtonProps) => {
  const { data: commentCount } = useCommentCount(
    questionId,
    initialCommentCount,
  );

  return (
    <div className="flex cursor-pointer items-center gap-1.5 transition">
      <MessageSquare size={18} />
      <span className="text-sm font-medium">{commentCount}</span>
    </div>
  );
};

export default CommentButton;
