import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;

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

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;
    console.log("session in join:", session);

    if (!session || !userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 400 },
      );
    }

    const existingMember = await prisma.communityMember.findFirst({
      where: {
        userId,
        communityId: community.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "Already a member of this community" },
        { status: 200 },
      );
    }

    const newMember = await prisma.communityMember.create({
      data: {
        userId,
        communityId: community.id,
        role: "MEMBER",
      },
    });

    return NextResponse.json<ApiResponse<typeof newMember>>(
      {
        success: true,
        data: newMember,
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
