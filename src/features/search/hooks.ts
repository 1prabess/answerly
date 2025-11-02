import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchSearchResults } from "./services";
import { SearchQuestion } from "./types";

export function useSearch(query: string, debounce = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounce);
    return () => clearTimeout(timer);
  }, [query, debounce]);

  return useQuery<SearchQuestion[]>({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
    staleTime: 1000 * 60,
  });
}
