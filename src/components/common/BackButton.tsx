"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()} variant="outline" className="">
      <ArrowLeftIcon />
      Back
    </Button>
  );
};

export default BackButton;
