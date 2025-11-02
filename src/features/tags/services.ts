import { config } from "@/config";
import { ApiResponse } from "@/types/api";

export const fetchTagsByCategory = async (categoryId: string) => {
  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/categories/${categoryId}`,
  );
  const data: ApiResponse<string[]> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch tags");
  }

  return data.data;
};

// export const fetchTagsByCategory = async (categoryId: string) => {
//   console.log(categoryId);
//   const response = await axios.get(`/api/categories/${categoryId}`);
//   return response.data.data;
// };
