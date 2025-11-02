"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";
import { useFollowProfile, useProfile } from "../hooks";

type ProfileCardProps = {
  profileData: UserProfile;
  username: string;
  isOwnProfile: boolean;
  userId?: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function ProfileCard({
  profileData,
  username,
  isOwnProfile,
  userId,
}: ProfileCardProps) {
  const { data: profile } = useProfile(username, profileData);
  const { mutate: followProfile, isPending } = useFollowProfile(username);

  const profileInfo = profile?.data || profileData;
  const isFollowing = userId ? profileInfo.followers.includes(userId) : false;

  const handleFollowUser = () => {
    followProfile({
      currentUserId: userId!,
      userToFollowId: profileInfo.id,
    });
  };

  return (
    <aside className="order-1 w-full md:order-2 md:w-auto">
      <div className="rounded pt-4 md:fixed md:top-20 md:flex md:h-screen md:max-w-[25rem] md:flex-col md:overflow-hidden md:border-l md:px-8 md:pt-8">
        <div className="flex flex-1 flex-col py-4 md:py-6">
          {/* --- Mobile layout --- */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {profileInfo.image ? (
                  <Image
                    src={profileInfo.image}
                    alt={profileInfo.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center text-base font-semibold">
                    {getInitials(profileInfo.name)}
                  </div>
                )}

                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    @{username}
                  </h2>
                  <p className="text-muted-foreground text-base">
                    {profileInfo.followers.length} followers
                  </p>
                </div>
              </div>

              <div className="text-muted-foreground text-2xl font-semibold">
                ⋯
              </div>
            </div>

            {/* Bio / description */}
            <p className="text-muted-foreground text-sm sm:text-base">
              Sharing what I know, what I’ve read and what I think, or
              thereabouts.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              {!isOwnProfile && (
                <Button
                  size="sm"
                  className="w-full rounded text-sm"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowUser}
                  disabled={isPending}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>

          {/* --- Desktop layout --- */}
          <div className="hidden md:block">
            {profileInfo.image ? (
              <Image
                src={profileInfo.image}
                alt={profileInfo.name}
                width={70}
                height={70}
                className="border-background relative -mt-10 mb-1 rounded-full border-4 object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground border-background relative -mt-10 mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 text-xl font-semibold">
                {getInitials(profileInfo.name)}
              </div>
            )}

            <h2 className="text-foreground text-lg font-semibold">
              @{username}
            </h2>
            <p className="text-muted-foreground my-1">
              {profileInfo.followers.length} followers
            </p>

            <p className="text-muted-foreground my-3 text-sm">
              Sharing what I know, what I’ve read and what I think, or
              thereabouts.
            </p>

            <div className="mt-4 flex gap-2">
              {!isOwnProfile && (
                <Button
                  className="h-8 w-20 rounded"
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={handleFollowUser}
                  disabled={isPending}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

            <div className="mt-4 border-t pt-6">
              <h3 className="text-foreground mb-3 text-base font-semibold">
                Following
              </h3>

              <div className="flex flex-col gap-4">
                {[
                  { name: "Infinite Backlog", color: "bg-gray-800" },
                  { name: "Snipd", color: "bg-green-600" },
                  { name: "Eve Arnold", color: "bg-yellow-500" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${item.color} flex h-8 w-8 items-center justify-center rounded-full`}
                      />
                      <span className="text-foreground text-sm font-medium">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-muted-foreground">⋯</div>
                  </div>
                ))}

                <p className="text-muted-foreground mt-1 text-sm">
                  See all (40)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
