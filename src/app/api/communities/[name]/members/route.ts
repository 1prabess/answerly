import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!session || !userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const community = await prisma.community.findUnique({
      where: { name },
    });

    if (!community) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Community not found" },
        { status: 404 },
      );
    }

    const members = await prisma.communityMember.findMany({
      where: { communityId: community.id },
      select: {
        userId: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<typeof members>>({
      success: true,
      data: members,
    });
  } catch (error) {
    console.log("Error in getting the community members:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const { name } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!session || !userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 400 },
      );
    }

    const { targetUserId, newRole } = await request.json();

    if (!targetUserId || !newRole) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Missing targetUserId or newRole" },
        { status: 400 },
      );
    }

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

    const adminMember = await prisma.communityMember.findFirst({
      where: {
        communityId: community.id,
        userId,
      },
    });

    if (adminMember?.role !== "ADMIN") {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Forbidden.",
        },
        { status: 403 },
      );
    }

    const updatedMember = await prisma.communityMember.update({
      where: {
        communityId_userId: {
          communityId: community.id,
          userId: targetUserId,
        },
      },
      data: { role: newRole },
    });

    return NextResponse.json<ApiResponse<typeof updatedMember>>({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    console.log("Error in updating the role:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;
    const { name } = await params;

    if (!session || !userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const community = await prisma.community.findUnique({
      where: { name },
    });

    if (!community) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Community not found." },
        { status: 404 },
      );
    }

    const adminMember = await prisma.communityMember.findFirst({
      where: {
        communityId: community.id,
        userId,
      },
    });

    if (adminMember?.role !== "ADMIN") {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Forbidden." },
        { status: 403 },
      );
    }

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Missing targetUserId" },
        { status: 400 },
      );
    }

    const memberToDelete = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: community.id,
          userId: targetUserId,
        },
      },
    });

    if (!memberToDelete) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Member not found in community." },
        { status: 404 },
      );
    }

    if (targetUserId === userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Admins cannot remove themselves." },
        { status: 400 },
      );
    }

    await prisma.communityMember.delete({
      where: {
        communityId_userId: {
          communityId: community.id,
          userId: targetUserId,
        },
      },
    });

    return NextResponse.json<ApiResponse<{ targetUserId: string }>>({
      success: true,
      data: { targetUserId },
    });
  } catch (error) {
    console.log("Error in deleting the member from community:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
};
