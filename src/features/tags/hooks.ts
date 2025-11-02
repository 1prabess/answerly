import { useQuery } from "@tanstack/react-query";
import { fetchTagsByCategory } from "./services";

export const useTags = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["tags", categoryId],
    queryFn: () => fetchTagsByCategory(categoryId!),
    enabled: !!categoryId,
  });
};

export const useTagOptions = (tags: any[] = []) => {
  return tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));
};
