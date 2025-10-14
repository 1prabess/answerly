"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

type RecommendedQuestionCardProps = {
  image: string;
  title: string;
  subtitle: string;
  subreddit: string;
};

const RecommendedQuestionCard = ({
  image,
  title,
  subtitle,
  subreddit,
}: RecommendedQuestionCardProps) => {
  return (
    <Card className="relative max-w-[320px] min-w-[320px] snap-start overflow-hidden rounded-none border-none p-0">
      <div className="relative h-44 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 p-4 text-neutral-100">
        <h3 className="line-clamp-2 text-base font-semibold">{title}</h3>
        <p className="line-clamp-2 text-sm">{subtitle}</p>
        <div className="mt-2 text-xs opacity-90">
          {subreddit} <span>and more</span>
        </div>
      </div>
    </Card>
  );
};

const RecommendedQuestions = () => {
  const data: RecommendedQuestionCardProps[] = [
    {
      image: "https://picsum.photos/400/200?1",
      title: "Why is React so popular?",
      subtitle: "Discussion about the growth of React in frontend dev.",
      subreddit: "r/reactjs",
    },
    {
      image: "https://picsum.photos/400/200?2",
      title: "Best practices for Prisma schema?",
      subtitle: "How do you structure complex Prisma models?",
      subreddit: "r/prisma",
    },
    {
      image: "https://picsum.photos/400/200?3",
      title: "Next.js server actions explained",
      subtitle: "Is it production-ready yet?",
      subreddit: "r/nextjs",
    },
    {
      image: "https://picsum.photos/400/200?4",
      title: "State management in 2025",
      subtitle: "Zustand vs Redux vs Jotai vs Signals",
      subreddit: "r/javascript",
    },
  ];

  return (
    <div className="scrollbar-hide w-full snap-x overflow-x-auto scroll-smooth">
      <div className="flex gap-4">
        {data.map((item, idx) => (
          <RecommendedQuestionCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedQuestions;
