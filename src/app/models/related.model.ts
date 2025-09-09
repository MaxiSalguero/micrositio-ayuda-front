import { Like } from "./post.model";

export interface IRelated {
  id: number;
  post: Post;
  related: Post;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  status: string;
  slug: string;
  views: number;
  created: Date;
  updated: Date;
  likes: Like[];
}
