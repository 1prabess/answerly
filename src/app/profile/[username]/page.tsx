import ProfileCard from "@/features/profile/components/ProfileCard";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { FeedQuestion } from "@/types/question";
import NoQuestions from "../_components/NoQuestions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProfile } from "@/features/profile/services";
import EngagementBar from "@/features/questions/components/EngagementBar";

const UserProfile = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const { data: profileData, error } = await getProfile(username);

  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr] md:gap-12">
      <ProfileCard
        profileData={profileData}
        username={username!}
        isOwnProfile={session?.user?.id === profileData.id}
        userId={session?.user.id}
      />

      <div className="order-2 min-w-0 md:order-1">
        {profileData.questions.length === 0 ? (
          <NoQuestions username={username!} />
        ) : (
          <div>
            {profileData.questions.map((question: FeedQuestion) => (
              <div key={question.id} className="space-y-2 border-b py-4">
                <QuestionCard question={question} variant="small" />
                <EngagementBar
                  initialVotes={{
                    upVotes: question.upVotes,
                    downVotes: question.downVotes,
                    userVote: question.userVoted,
                    score: question.score,
                  }}
                  questionId={question.id}
                  commentCount={question?.commentCount || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
