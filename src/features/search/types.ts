export type SearchQuestion = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  author?: {
    name?: string | null;
    image?: string | null;
  } | null;
  community?: {
    name?: string | null;
  } | null;
  tags: Array<{ name: string }>;
};
