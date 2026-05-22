"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MAX_POST_LENGTH, type Post } from "@/lib/types";

type PostsContextValue = {
  posts: Post[];
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  addPost: (topicId: string, body: string) => Post | null;
  filteredPosts: Post[];
  scrollToNewestKey: number;
};

const PostsContext = createContext<PostsContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [scrollToNewestKey, setScrollToNewestKey] = useState(0);

  const addPost = useCallback((topicId: string, body: string): Post | null => {
    const trimmed = body.trim();
    if (!trimmed || trimmed.length > MAX_POST_LENGTH) return null;

    const post: Post = {
      id: createId(),
      topicId,
      body: trimmed,
      createdAt: Date.now(),
    };

    setPosts((prev) => [post, ...prev]);
    setScrollToNewestKey((k) => k + 1);
    return post;
  }, []);

  const filteredPosts = useMemo(() => {
    const list =
      selectedTopicId === null
        ? posts
        : posts.filter((p) => p.topicId === selectedTopicId);
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, selectedTopicId]);

  const value = useMemo(
    () => ({
      posts,
      selectedTopicId,
      setSelectedTopicId,
      addPost,
      filteredPosts,
      scrollToNewestKey,
    }),
    [posts, selectedTopicId, addPost, filteredPosts, scrollToNewestKey],
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts must be used within PostsProvider");
  }
  return ctx;
}
