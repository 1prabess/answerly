"use client";

import Image from "next/image";

type NoQuestionsProps = {
  username: string;
};

const NoQuestions = ({ username }: NoQuestionsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Image
        src="https://www.redditstatic.com/desktop2x/img/snoo-thinking.png"
        alt="reddit snoo"
        width={48}
        height={48}
        priority
      />
      <p className="text-muted-foreground mt-4 text-sm font-medium">
        u/{username} hasn&apos;t posted yet
      </p>
    </div>
  );
};

export default NoQuestions;
