"use client";

import { authClient } from "@/lib/auth-client";
import { getProfile } from "@/lib/services/profile";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FeedQuestion } from "@/types/question";
import ProfileQuestionCard from "./_components/ProfileQuestionCard";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { ProfileSkeleton } from "./_components/ProfileSkeleton";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const MyProfilePage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const username = session?.user.username;

  const { data: profileData, isPending: isProfileLoading } =
    useQuery<UserProfile>({
      queryKey: ["profile", username],
      queryFn: () => getProfile(username!, 1, 10),
      enabled: !!username,
    });

  if (isSessionLoading || isProfileLoading) return <ProfileSkeleton />;
  if (!session || !profileData)
    return (
      <div className="text-center text-sm text-muted-foreground">
        No profile found
      </div>
    );

  return (
    <div className=" grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-12 ">
      {/* Right Column (Sidebar) */}
      <aside className="order-1 min-w-xs md:order-2 w-full md:w-auto">
        <div className="border rounded pt-14  md:sticky md:top-20">
          <div className="px-4 py-6 flex flex-col items-center">
            {profileData.image ? (
              <Image
                src={profileData.image}
                alt={profileData.name}
                width={80}
                height={80}
                className="relative -mt-10 mb-3 rounded-full border-4 border-background object-cover"
              />
            ) : (
              <div className="relative -mt-10 mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground border-4 border-background">
                {getInitials(profileData.name)}
              </div>
            )}
            <h2 className="text-lg font-semibold text-foreground">
              @{username}
            </h2>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                Share
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-4 w-full text-center pb-10">
            <div>
              <p className="font-semibold">{profileData.followers.length}</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="font-semibold">{profileData.following.length}</p>
              <p className="text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="font-semibold">{profileData.questions.length}</p>
              <p className="text-muted-foreground">Contributions</p>
            </div>
            <div>
              <p className="font-semibold">1w</p>
              <p className="text-muted-foreground">Reddit Age</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Left Side (Questions) */}
      <div className="order-2 md:order-1 min-w-0">
        <div className="flex gap-4 border-b pb-2 mb-4">
          <button className="text-sm font-medium text-foreground border-b-2 border-foreground">
            Questions
          </button>
        </div>
        {profileData.questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Image
              src="https://www.redditstatic.com/desktop2x/img/snoo-thinking.png"
              alt="reddit snoo"
              width={48}
              height={48}
              priority
            />
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              u/{username} hasn&apos;t posted yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.questions.map((q: FeedQuestion) => (
              <ProfileQuestionCard
                key={q.id}
                question={q}
                userId={session?.user.id!}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;
