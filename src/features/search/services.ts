import { config } from "@/config";
import { SearchQuestion } from "./types";

export const fetchSearchResults = async (
  query: string,
): Promise<SearchQuestion[]> => {
  if (!query.trim()) return [];

  const response = await fetch(
    `${config.NEXT_PUBLIC_BASE_URL}/api/search?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data: SearchQuestion[] = await response.json();
  return data.slice(0, 5);
};
