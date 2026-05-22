"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TOPICS } from "@/lib/topics";
import { usePosts } from "@/context/PostsContext";

const SCROLL_STEP = 220;

export function TopicPicker() {
  const { selectedTopicId, setSelectedTopicId } = usePosts();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isAll = selectedTopicId === null;

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();

    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  function scrollTopics(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;
    const delta = direction === "left" ? -SCROLL_STEP : SCROLL_STEP;
    track.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div className="topic-picker">
      <p className="topic-picker-label">Choose a thread</p>
      <div className="topic-picker-controls">
        <button
          type="button"
          className="scroll-nav-btn"
          aria-label="Scroll topics left"
          disabled={!canScrollLeft}
          onClick={() => scrollTopics("left")}
        >
          ←
        </button>

        <div className="topic-picker-scroll">
          <div
            ref={trackRef}
            className="topic-picker-track"
            role="tablist"
            aria-label="Topics"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isAll}
              className={`topic-chip ${isAll ? "topic-chip-active" : ""}`}
              onClick={() => setSelectedTopicId(null)}
            >
              All
            </button>
            {TOPICS.map((topic) => {
              const active = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`topic-chip ${active ? "topic-chip-active" : ""}`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  {topic.title}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="scroll-nav-btn"
          aria-label="Scroll topics right"
          disabled={!canScrollRight}
          onClick={() => scrollTopics("right")}
        >
          →
        </button>
      </div>
    </div>
  );
}
