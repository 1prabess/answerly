import { Question } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { createQuestionSchema } from "@/lib/zod/question";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// Get all questions
export const GET = async (request: NextRequest) => {
  try {
    const questions = await prisma.question.findMany();

    return NextResponse.json<ApiResponse<Question[]>>(
      {
        success: true,
        message: "Questions fetched successfully.",
        data: questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in questions [GET]", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};

// Create an question
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (!body.title || !body.authorId)
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Title and Author Id is required.",
        },
        { status: 400 }
      );

    const validated = createQuestionSchema.safeParse(body);

    if (!validated.success) {
      const allErrors = Object.values(validated.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          message: "Validation error.",
          error: allErrors,
        },
        { status: 400 }
      );
    }

    const { title, description, image, authorId } = validated.data;

    const question = await prisma.question.create({
      data: {
        title,
        description,
        image,
        authorId,
      },
    });

    return NextResponse.json<ApiResponse<Question>>(
      {
        success: true,
        message: "Question created successfully.",
        data: question,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in questions [POST]", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
