"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateComment } from "../hooks";

type CommentInputProps = {
  questionId: string;
};

const CommentInput = ({ questionId }: CommentInputProps) => {
  const [content, setContent] = useState("");

  const { mutate: createComment, isPending } = useCreateComment(questionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    createComment(content);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
    >
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 rounded-none border-0 border-b bg-transparent px-0 py-2 text-sm shadow-none transition-all duration-150 focus:border-b-2 focus-visible:ring-0 sm:py-3 dark:bg-transparent"
        disabled={isPending}
      />
      <Button
        onClick={handleSubmit}
        variant="default"
        className="w-full px-6 font-medium transition-all duration-200 hover:opacity-90 sm:w-auto"
        disabled={!content.trim() || isPending}
      >
        {isPending ? "Posting..." : "Comment"}
      </Button>
    </form>
  );
};

export default CommentInput;
