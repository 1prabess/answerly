import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { Community } from "@/types/community";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Create community
export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { name, description, avatar, banner } = body;

    if (!name) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Community name is required" },
        { status: 400 },
      );
    }

    const community = await prisma.community.create({
      data: {
        name,
        description,
        avatar,
        banner,
        CommunityMember: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<Community>>({
      success: true,
      data: community,
    });
  } catch (error) {
    console.log("Error in creating community:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
