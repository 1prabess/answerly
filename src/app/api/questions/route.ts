import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateQuestionSchema } from "@/lib/zod/questionSchema";
import { ApiResponse } from "@/types/api";
import { FeedQuestion, Question } from "@/types/question";
import { NextRequest, NextResponse } from "next/server";

// Get questions from all users
export const GET = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id;

    const questions = await prisma.question.findMany({
      include: {
        author: true,
        votes: true,
        tags: true,
        _count: { select: { comments: true } },
        community: {
          select: { id: true, name: true, avatar: true },
        },
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
        community: q.community,
      };
    });

    return NextResponse.json<ApiResponse<FeedQuestion[]>>(
      {
        success: true,
        message: "Questions fetched successfully.",
        data: formattedQuestions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error fetching questions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};

// Create question
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (!body.title || !body.authorId)
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Title and Author Id is required.",
        },
        { status: 400 },
      );

    const validated = CreateQuestionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Validation failed!",
        },
        { status: 400 },
      );
    }

    const { title, description, image, authorId, tagNames } = validated.data;

    const tags = await prisma.tag.findMany({
      where: { name: { in: tagNames } },
    });

    // const foundTags = tags.map((tag) => tag.name);

    // const missingTags = tagNames.filter(
    //   (name: string) => !foundTags.includes(name),
    // );

    // if (missingTags.length > 0) {
    //   return NextResponse.json<ApiResponse<never>>(
    //     {
    //       success: false,
    //       error: missingTags,
    //     },
    //     { status: 400 },
    //   );
    // }

    const question: Question = await prisma.question.create({
      data: {
        title,
        description,
        image,
        authorId,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: { tags: true },
    });

    return NextResponse.json<ApiResponse<Question>>(
      {
        success: true,
        message: "Question created successfully.",
        data: question,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating question:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
