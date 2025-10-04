import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });
    return NextResponse.json<ApiResponse<typeof categories>>({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log("Error in fetching the categories:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
};
