"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type NewsCardProps = {
  image: string;
  title: string;
  subtitle: string;
  subreddit: string;
};

const NewsCard: React.FC<NewsCardProps> = ({
  image,
  title,
  subtitle,
  subreddit,
}) => {
  return (
    <Card className="relative rounded-sm min-w-[320px] max-w-[320px] p-0 border-none  overflow-hidden snap-start">
      <div className="relative w-full h-44">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 p-4 text-neutral-100">
        <h3 className="font-semibold text-base line-clamp-2">{title}</h3>
        <p className="text-sm line-clamp-2">{subtitle}</p>
        <div className="text-xs mt-2 opacity-90">
          {subreddit} <span>and more</span>
        </div>
      </div>
    </Card>
  );
};

const ScrollableNewsFeed = () => {
  const data: NewsCardProps[] = [
    {
      image: "https://picsum.photos/400/200?1",
      title: "Trump on troops to Portland",
      subtitle: "Trump says he'll send troops to Portland",
      subreddit: "r/Portland",
    },
    {
      image: "https://picsum.photos/400/200?2",
      title: "Streep greets Wintour in Milan",
      subtitle: "Meryl Streep and Anna Wintour hugging in Milan",
      subreddit: "r/popculturechat",
    },
    {
      image: "https://picsum.photos/400/200?3",
      title: "Verstappen makes GT3 debut",
      subtitle: "Max Verstappen becomes the first F1 driver to debut GT3",
      subreddit: "r/formula1",
    },
    {
      image: "https://picsum.photos/400/200?4",
      title: "Denmark drone sighting",
      subtitle: "Denmark and Norway report unusual drone activity",
      subreddit: "r/europe",
    },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide scroll-smooth snap-x">
      <div className="flex gap-4">
        {data.map((item, idx) => (
          <NewsCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ScrollableNewsFeed;
