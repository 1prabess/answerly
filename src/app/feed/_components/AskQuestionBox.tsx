"use client";

import React, { useState } from "react";
import QuestionFormModal from "./QuestionFormModal";

interface AskBoxProps {
  avatar: string | "";
  name: string;
}

const AskQuestionBox = ({ avatar, name }: AskBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mx-auto mt-2 space-y-2">
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 rounded-full border-2  p-2 cursor-pointer "
      >
        <div className="flex items-center gap-2">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>

        <span className="text-muted-foreground">
          Click here to ask an question.
        </span>
      </div>

      <QuestionFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AskQuestionBox;
