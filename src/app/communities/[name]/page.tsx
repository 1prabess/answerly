import CommunityHeader from "@/features/communities/components/CommunityHeader";
import QuestionCard from "@/features/questions/components/QuestionCard";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FeedQuestion } from "@/types/question";
import { CommunityDetails } from "@/types/community";
import EngagementBar from "@/features/questions/components/EngagementBar";
import Questions from "@/features/questions/components/Questions";
import CommunityQuestions from "@/features/questions/components/CommunityQuestions";

const CommunityPage = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const { name } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user.id;

  const community = await prisma.community.findUnique({
    where: { name },
    include: { _count: { select: { CommunityMember: true } } },
  });

  if (!community) return <div>Community not found.</div>;

  const hasJoined =
    currentUserId &&
    (await prisma.communityMember.count({
      where: { userId: currentUserId, communityId: community.id },
    })) > 0;

  const questions = await prisma.question.findMany({
    where: { communityId: community.id },
    include: {
      author: true,
      votes: true,
      tags: true,
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedQuestions: FeedQuestion[] = questions.map((q) => {
    const upVotes = q.votes.filter((v) => v.type === "UP").length;
    const downVotes = q.votes.filter((v) => v.type === "DOWN").length;
    const userVoted = currentUserId
      ? q.votes.find((v) => v.userId === currentUserId)?.type || null
      : null;

    return {
      id: q.id,
      title: q.title,
      description: q.description,
      image: q.image,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      authorId: q.authorId,
      author: q.author,
      tags: q.tags,
      upVotes,
      downVotes,
      score: upVotes - downVotes,
      userVoted,
      commentCount: q._count.comments,
    };
  });

  const communityDetails: CommunityDetails = {
    id: community.id,
    name: community.name,
    description: community.description,
    avatar: community.avatar ?? null,
    banner: community.banner ?? null,
    joined: !!hasJoined,
    memberCount: community._count.CommunityMember,
    questions: formattedQuestions,
  };

  return (
    <div>
      <CommunityHeader initialCommunityDetails={communityDetails} />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <div role="list" aria-label="Question feed">
          <CommunityQuestions
            communityName={communityDetails.name}
            initialQuestions={communityDetails.questions}
            variant="small"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
