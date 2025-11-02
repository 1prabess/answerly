"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useSearch } from "@/features/search/hooks";
import { SearchQuestion } from "@/features/search/types";

type SearchBarProps = {
  fullWidthOnMobile?: boolean;
};

const SearchBar = ({ fullWidthOnMobile = false }: SearchBarProps = {}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isLoading } = useSearch(query);

  const clearSearch = () => {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown immediately when typing
  useEffect(() => {
    setOpen(!!query.trim());
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "bg-background/95 supports-[backdrop-filter]:bg-background/60 h-10 w-full border backdrop-blur",
            "focus-visible:ring-ring focus-visible:ring-1",
            open && "rounded-b-none border-b-0",
          )}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={cn(
            "bg-card z-50 mt-0 border border-t-0 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            fullWidthOnMobile
              ? "fixed inset-x-0 top-0 rounded-t-none rounded-b-lg"
              : "absolute top-full right-0 left-0 rounded-b-lg",
          )}
        >
          {isLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-muted-foreground px-4 py-3 text-sm">
              No results found.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((q: SearchQuestion, index) => (
                <Link
                  key={q.id}
                  href={`/question/${q.id}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "hover:bg-accent/50 block px-4 py-3 transition-colors",
                    index !== results.length - 1 && "border-b",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex-shrink-0">
                        {q.author?.image ? (
                          <Image
                            src={q.author.image}
                            alt={q.author.name || "User"}
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600" />
                        )}
                      </div>
                      <span className="text-foreground font-medium">
                        {q.author?.name || "Anonymous"}
                      </span>
                      <span className="text-muted-foreground">
                        {timeAgo(q.createdAt)}
                      </span>
                    </div>
                    {q.community?.name && (
                      <div className="bg-muted flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                        <span className="text-primary">a/</span>
                        <span>{q.community.name.replace(/^a\//, "")}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-foreground mb-1 text-base leading-tight font-bold">
                    {q.title}
                  </h3>

                  {q.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {q.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.name}
                          className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {q.tags.length > 3 && (
                        <span className="text-muted-foreground text-xs">
                          +{q.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {q.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {q.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
