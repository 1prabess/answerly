import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { FeedQuestion, Question } from "@/types/question";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;
    const body = await request.json();

    if (!body.title || !body.authorId)
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Title and Author Id is required.",
        },
        { status: 400 },
      );

    const { title, description, image, authorId, tagNames } = body;

    const tags = await prisma.tag.findMany({
      where: { name: { in: tagNames } },
    });

    const community = await prisma.community.findUnique({
      where: {
        name,
      },
    });

    if (!community) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Community not found.",
        },
        { status: 404 },
      );
    }

    const question = await prisma.question.create({
      data: {
        title,
        description,
        image,
        authorId,
        communityId: community.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    return NextResponse.json<ApiResponse<Question>>(
      {
        success: true,
        message: "Question created successfully in the community.",
        data: question,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating community:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;

    const community = await prisma.community.findUnique({
      where: { name },
    });

    if (!community) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Community not found." },
        { status: 404 },
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const questions = await prisma.question.findMany({
      where: {
        communityId: community.id,
      },
      include: {
        author: true,
        votes: true,
        tags: true,
        _count: { select: { comments: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedQuestions: FeedQuestion[] = questions.map((q) => {
      const upVotes = q.votes.filter((v) => v.type === "UP").length;
      const downVotes = q.votes.filter((v) => v.type === "DOWN").length;
      const userVoted = userId
        ? q.votes.find((v) => v.userId === userId)?.type || null
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

    return NextResponse.json<ApiResponse<FeedQuestion[]>>(
      {
        success: true,
        message: "Community questions fetched successfully.",
        data: formattedQuestions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in getting community questions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
