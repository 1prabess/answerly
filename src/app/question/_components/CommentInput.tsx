"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/lib/services/comments";

type CommentInputProps = {
  questionId: string;
};

const CommentInput = ({ questionId }: CommentInputProps) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  // React Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (newContent: string) => createComment(questionId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", questionId] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setContent("");
    },
    onError: (error) => {
      console.error("Failed to post comment:", error);
    },
  });

  // Handle form submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    mutate(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
    >
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="flex-1 border-2 shadow-none focus-visible:ring-1 py-2 sm:py-4"
        disabled={isPending}
      />
      <Button
        type="submit"
        variant="default"
        className="sm:w-auto w-full"
        disabled={!content.trim() || isPending}
      >
        {isPending ? "Posting..." : "Post"}
      </Button>
    </form>
  );
};

export default CommentInput;
