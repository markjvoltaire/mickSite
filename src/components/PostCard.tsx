"use client";

import { getTopicById } from "@/lib/topics";
import { formatRelativeTime } from "@/lib/format";
import type { Post } from "@/lib/types";

type PostCardProps = {
  post: Post;
  isActive?: boolean;
};

export function PostCard({ post, isActive = false }: PostCardProps) {
  const topic = getTopicById(post.topicId);

  return (
    <article
      className={`post-card ${isActive ? "post-card-active" : ""}`}
      aria-label={topic?.title ?? "Post"}
    >
      <header className="post-card-header">
        <span className="post-card-topic">{topic?.title ?? "Unknown topic"}</span>
        <span className="post-card-meta">
          <span className="post-card-guest">Guest</span>
          <span aria-hidden="true">·</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {formatRelativeTime(post.createdAt)}
          </time>
        </span>
      </header>
      <p className="post-card-body">{post.body}</p>
      <footer className="post-card-footer">
        <span className="post-card-length">{post.body.length} chars</span>
      </footer>
    </article>
  );
}
