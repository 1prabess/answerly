import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UsernameSchema } from "@/lib/zod/authSchema";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username } = await request.json();

    const validated = UsernameSchema.safeParse({ username });
    if (!validated.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid username" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Username is already taken" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    return NextResponse.json<ApiResponse<never>>({ success: true });
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
