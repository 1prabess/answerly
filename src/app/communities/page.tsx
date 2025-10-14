"use client";

import { useGetCommunity } from "@/features/communities/hooks";
import React from "react";

const Communities = () => {
  const { data } = useGetCommunity("imagesTest");
  console.log(data);
  return <div>Communities</div>;
};

export default Communities;
