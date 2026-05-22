import type { Topic } from "./types";

export const TOPICS: Topic[] = [
  {
    id: "surprised",
    title: "What surprised you this week?",
    blurb: "Something unexpected — big or tiny.",
  },
  {
    id: "habit",
    title: "A small habit that changed everything",
    blurb: "The routine you didn't think would stick.",
  },
  {
    id: "hot-take",
    title: "Hot take you'll defend",
    blurb: "Controversial? Maybe. Honest? Always.",
  },
  {
    id: "book-film",
    title: "Book or film that stuck with you",
    blurb: "What lingered after the credits rolled.",
  },
  {
    id: "learned",
    title: "Something you learned the hard way",
    blurb: "Wisdom bought with bruises.",
  },
  {
    id: "local",
    title: "Hidden gem in your neighborhood",
    blurb: "The place only locals seem to know.",
  },
  {
    id: "unpopular",
    title: "Unpopular opinion, kindly stated",
    blurb: "Disagree? That's the point.",
  },
  {
    id: "grateful",
    title: "One thing you're grateful for today",
    blurb: "Small thanks count double here.",
  },
  {
    id: "advice",
    title: "Advice you'd give your younger self",
    blurb: "Three hundred characters of hindsight.",
  },
  {
    id: "question",
    title: "A question you've been sitting with",
    blurb: "No answer required — just the asking.",
  },
];

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
