"use client";

import { CommunityDetails } from "@/types/community";
import { Globe, Calendar } from "lucide-react";
import { useGetCommunity } from "../hooks";

type CommunityIntroProps = {
  initialCommunityDetails: CommunityDetails;
};

const CommunityIntro = ({ initialCommunityDetails }: CommunityIntroProps) => {
  const { data: community } = useGetCommunity(
    initialCommunityDetails.name,
    initialCommunityDetails,
  );

  if (!community) return null;

  const createdDate = new Date(community.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <aside>
      <div className="space-y-4">
        <div className="sm:bg-muted/60 sm:dark:bg-muted/40 sm:px-4 sm:py-4">
          <div className="mb-4 hidden items-center justify-between sm:flex">
            <h1 className="text-xl font-semibold">a/{community.name}</h1>
          </div>

          <p className="text-muted-foreground mb-2 text-sm">
            {community.description}
          </p>

          <div className="text-muted-foreground my-4 flex flex-col gap-2 space-x-4 border-b pb-4 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar size="16" />
              <span>Created {createdDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe size="16" />
              <span>Public</span>
            </div>
          </div>

          <div className="mb-6 flex justify-start space-x-12">
            <div>
              <p className="text-xl font-semibold">{community.memberCount}</p>
              <p className="text-muted-foreground text-sm">Total Members</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {community.totalQuestions}
              </p>
              <p className="text-muted-foreground text-sm">Total questions</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CommunityIntro;
