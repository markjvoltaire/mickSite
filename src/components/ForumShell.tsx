"use client";

import { TopicPicker } from "./TopicPicker";
import { ComposeForm } from "./ComposeForm";
import { HorizontalFeed } from "./HorizontalFeed";

export function ForumShell() {
  return (
    <div className="forum-shell">
      <header className="site-header">
        <p className="site-eyebrow">Community · 300 characters</p>
        <h1 className="site-title">Sidewrite</h1>
        <p className="site-tagline">
          Pick a thread, leave a short thought, slide through what others shared.
        </p>
      </header>

      <TopicPicker />
      <ComposeForm />
      <HorizontalFeed />
    </div>
  );
}
