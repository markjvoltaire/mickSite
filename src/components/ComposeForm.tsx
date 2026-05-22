"use client";

import { useEffect, useState } from "react";
import { usePosts } from "@/context/PostsContext";
import { TOPICS, getTopicById } from "@/lib/topics";
import { MAX_POST_LENGTH } from "@/lib/types";

export function ComposeForm() {
  const { selectedTopicId, addPost } = usePosts();
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [composeTopicId, setComposeTopicId] = useState(TOPICS[0].id);

  const isAllView = selectedTopicId === null;
  const topicId = selectedTopicId ?? composeTopicId;
  const topic = getTopicById(topicId);

  useEffect(() => {
    if (selectedTopicId !== null) {
      setComposeTopicId(selectedTopicId);
    }
  }, [selectedTopicId]);

  if (!topic) return null;

  const remaining = MAX_POST_LENGTH - body.length;
  const nearLimit = remaining <= 40;
  const atLimit = remaining <= 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const post = addPost(topicId, body);
    if (post) {
      setBody("");
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 2000);
    }
  }

  return (
    <section className="compose-panel" aria-labelledby="compose-heading">
      <div className="compose-header">
        <h2 id="compose-heading" className="compose-title">
          {isAllView ? "Write a post" : "Write on this thread"}
        </h2>
        {isAllView ? (
          <div className="compose-topic-field">
            <label htmlFor="compose-topic" className="compose-topic-label">
              Thread
            </label>
            <select
              id="compose-topic"
              className="compose-topic-select"
              value={composeTopicId}
              onChange={(e) => setComposeTopicId(e.target.value)}
            >
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <p className="compose-blurb">{topic.blurb}</p>
      </div>
      <form onSubmit={handleSubmit} className="compose-form">
        <label htmlFor="post-body" className="sr-only">
          Your post for {topic.title}
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={MAX_POST_LENGTH}
          rows={4}
          placeholder="Share your take in 300 characters…"
          className="compose-textarea"
        />
        <div className="compose-footer">
          <span
            className={`char-counter ${nearLimit ? "char-counter-warn" : ""} ${atLimit ? "char-counter-max" : ""}`}
            aria-live="polite"
          >
            {body.length} / {MAX_POST_LENGTH}
          </span>
          <button
            type="submit"
            className="compose-submit"
            disabled={!body.trim()}
          >
            {submitted ? "Posted" : "Post"}
          </button>
        </div>
      </form>
    </section>
  );
}
