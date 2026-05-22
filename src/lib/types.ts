export const MAX_POST_LENGTH = 300;

export type Topic = {
  id: string;
  title: string;
  blurb: string;
};

export type Post = {
  id: string;
  topicId: string;
  body: string;
  createdAt: number;
};
