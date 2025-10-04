import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id: categoryId } = await params;

  try {
    const tags = await prisma.tag.findMany({
      where: { categoryId },
      select: { id: true, name: true },
    });
    return NextResponse.json<ApiResponse<typeof tags>>({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error in fetching tags by category:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
