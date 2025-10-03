import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  console.log("here");
  const { id: categoryId } = await params;
  console.log("here");
  console.log(categoryId);

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
    console.error("Error fetching tags by category:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
