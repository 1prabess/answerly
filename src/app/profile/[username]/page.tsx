"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { followUser, getProfile } from "@/lib/services/profile";
import { FeedQuestion } from "@/types/question";
import ProfileQuestionCard from "../_components/ProfileQuestionCard";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ProfileSkeleton } from "../_components/ProfileSkeleton";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UserProfile = () => {
  const { username } = useParams();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  if (!username || Array.isArray(username)) return <div>Invalid username</div>;

  useEffect(() => {
    if (session?.user.username === username) {
      router.push("/profile");
    }
  }, [session, username, router]);

  const { data: profileData, isPending: isProfileLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username, 1, 10),
    enabled: !!username,
  });

  const { mutate, isPending: isFollowingInProcess } = useMutation({
    mutationFn: () => followUser(userId!, profileData.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  if (isSessionLoading || isProfileLoading) return <ProfileSkeleton />;
  if (!profileData) return <div>No profile found</div>;

  const handleFollow = () => mutate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-12">
      <aside className="order-1 min-w-xs md:order-2 w-full md:w-auto">
        <div className="border pt-14 rounded md:sticky md:top-20">
          <div className="px-4 py-6 flex flex-col items-center">
            {profileData.image ? (
              <Image
                src={profileData.image}
                alt={profileData.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-white mb-3"
              />
            ) : (
              <div className="relative -mt-10 mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground border-4 border-background">
                {getInitials(profileData.name)}
              </div>
            )}
            <h2 className="font-bold text-lg">@{username}</h2>

            {/* Actions */}
            <div className="flex gap-2 mt-2 w-full max-w-xs mx-auto">
              <Button className="flex-1 shadow-none bg-background border hover:bg-background text-foreground">
                Share
              </Button>
              <Button
                disabled={isFollowingInProcess}
                onClick={handleFollow}
                className={`flex-1 ${
                  profileData.followers.includes(userId!)
                    ? "bg-background shadow-none border hover:bg-background text-foreground"
                    : ""
                }`}
              >
                {profileData.followers.includes(userId!)
                  ? "Following"
                  : "Follow"}
              </Button>
            </div>
          </div>

          {/* Stats */}
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

      {/* LEFT SIDE (questions) */}
      <div className="order-2 md:order-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2 text-sm font-medium text-muted-foreground mb-4">
          <button className="text-foreground border-b-2 border-foreground">
            Questions
          </button>
        </div>

        {/* Questions */}
        {profileData.questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Image
              src="https://www.redditstatic.com/desktop2x/img/snoo-thinking.png"
              alt="reddit snoo"
              width={56}
              height={56}
              priority
            />
            <p className="text-center mt-4 font-medium">
              u/{username} hasn&apos;t posted yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.questions.map((q: FeedQuestion) => (
              <ProfileQuestionCard key={q.id} question={q} userId={userId!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
