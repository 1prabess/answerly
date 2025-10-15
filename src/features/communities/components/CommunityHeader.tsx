"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useGetCommunity, useJoinCommunity } from "../hooks";
import { CommunityDetails } from "@/types/community";
import CommunityQuestionFormModal from "@/features/questions/components/CommunityQuestionFormModal";

type CommunityHeaderProps = {
  initialCommunityDetails: CommunityDetails;
};

const CommunityHeader = ({ initialCommunityDetails }: CommunityHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: community } = useGetCommunity(
    initialCommunityDetails.name,
    initialCommunityDetails,
  );

  if (!community) return null;

  const { mutate: joinCommunity } = useJoinCommunity();

  const handleJoinCommunity = () => {
    joinCommunity(community?.name);
  };

  const avatarInitial = community?.name.charAt(0).toUpperCase();

  return (
    <>
      <div className="bg-background w-full">
        {community?.banner ? (
          <div className="relative h-32 w-full overflow-hidden md:h-48">
            <Image
              src={community.banner}
              alt="Community banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="sm:bg-muted/60 sm:dark:bg-muted/40 relative h-32 w-full overflow-hidden rounded md:h-48"></div>
        )}

        <div className="relative flex flex-col items-start justify-between pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="border-background bg-background absolute -top-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 sm:-top-10 sm:h-20 sm:w-20">
              {community?.avatar ? (
                <Image
                  src={community.avatar}
                  alt="Community avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-semibold text-gray-700">
                  {avatarInitial}
                </div>
              )}
            </div>

            <div className="pt-8 sm:pt-10">
              <h1 className="text-xl font-semibold sm:text-2xl">
                a/{community?.name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {community?.memberCount} members
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <Button
              variant="outline"
              className="rounded-full text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              + Create Post
            </Button>
            <Button
              onClick={handleJoinCommunity}
              className="rounded-full text-sm disabled:cursor-not-allowed"
            >
              {!community?.joined ? "Join" : "Joined"}
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CommunityQuestionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        communityName={community?.name}
      />
    </>
  );
};

export default CommunityHeader;
