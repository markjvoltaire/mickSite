"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { usePosts } from "@/context/PostsContext";
import { getTopicById } from "@/lib/topics";
import { PostCard } from "./PostCard";

export function HorizontalFeed() {
  const { filteredPosts, selectedTopicId, scrollToNewestKey } = usePosts();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track || filteredPosts.length === 0) return;
    const clamped = Math.max(0, Math.min(index, filteredPosts.length - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(clamped);
  }, [filteredPosts.length]);

  useEffect(() => {
    setActiveIndex(0);
    const track = trackRef.current;
    if (track) track.scrollLeft = 0;
  }, [selectedTopicId]);

  useEffect(() => {
    if (filteredPosts.length > 0) scrollToIndex(0);
  }, [scrollToNewestKey, filteredPosts.length, scrollToIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const el = track;

    function onScroll() {
      const slides = Array.from(el.children) as HTMLElement[];
      if (slides.length === 0) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(slideCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [filteredPosts.length]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || e.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
    };
    track.setPointerCapture(e.pointerId);
    track.classList.add("feed-track-dragging");
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragRef.current.startX;
    track.scrollLeft = dragRef.current.scrollLeft - dx;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const track = trackRef.current;
    track?.releasePointerCapture(e.pointerId);
    track?.classList.remove("feed-track-dragging");
  }

  const topic = selectedTopicId ? getTopicById(selectedTopicId) : null;
  const filterLabel =
    selectedTopicId === null ? "All threads" : topic?.title ?? "This thread";

  if (filteredPosts.length === 0) {
    return (
      <section className="feed-section" aria-label="Community feed">
        <div className="feed-header">
          <h2 className="feed-title">The feed</h2>
          <p className="feed-subtitle">{filterLabel}</p>
        </div>
        <div className="feed-empty">
          <p className="feed-empty-title">No posts yet</p>
          <p className="feed-empty-text">
            {selectedTopicId === null
              ? "Pick a topic above and be the first to share."
              : "Be the first to write on this thread."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="feed-section" aria-label="Community feed">
      <div className="feed-header">
        <h2 className="feed-title">The feed</h2>
        <p className="feed-subtitle">{filterLabel}</p>
      </div>

      <div className="feed-controls">
        <button
          type="button"
          className="scroll-nav-btn feed-nav-btn"
          aria-label="Previous post"
          disabled={activeIndex <= 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
        >
          ←
        </button>

        <div
          ref={trackRef}
          className="feed-track"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`Posts, ${activeIndex + 1} of ${filteredPosts.length}`}
          onKeyDown={handleKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          {filteredPosts.map((post, index) => (
            <div key={post.id} className="feed-slide">
              <PostCard post={post} isActive={index === activeIndex} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="scroll-nav-btn feed-nav-btn"
          aria-label="Next post"
          disabled={activeIndex >= filteredPosts.length - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
        >
          →
        </button>
      </div>

      <div className="feed-indicator" aria-hidden="true">
        <span className="feed-fraction">
          {activeIndex + 1} / {filteredPosts.length}
        </span>
        <div className="feed-dots">
          {filteredPosts.map((post, index) => (
            <button
              key={post.id}
              type="button"
              className={`feed-dot ${index === activeIndex ? "feed-dot-active" : ""}`}
              aria-label={`Go to post ${index + 1}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
