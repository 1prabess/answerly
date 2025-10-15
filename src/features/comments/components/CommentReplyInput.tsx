"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useReplyComment } from "../hooks";

type CommentReplyInputProps = {
  questionId: string;
  parentCommentId: string;
  onCancel?: () => void;
};

export default function CommentReplyInput({
  questionId,
  parentCommentId,
  onCancel,
}: CommentReplyInputProps) {
  const [content, setContent] = useState("");

  const { mutate: replyComment, isPending } = useReplyComment(
    questionId,
    parentCommentId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    replyComment(content.trim());
    setContent("");
  };

  return (
    <form className="mt-2 flex items-center gap-2" onSubmit={handleSubmit}>
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 rounded-none border-0 border-b bg-transparent px-0 py-1 text-sm shadow-none transition-all duration-150 focus:border-b-2 focus-visible:ring-0 dark:bg-transparent"
        disabled={isPending}
      />
      <Button type="submit" disabled={!content.trim() || isPending}>
        {isPending ? "Replying..." : "Reply"}
      </Button>
      {onCancel && (
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </form>
  );
}
