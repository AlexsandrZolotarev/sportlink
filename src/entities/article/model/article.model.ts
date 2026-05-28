export interface ArticleAuthor {
  id: number;
  name: string;
  avatar: string;
}

export interface ArticleStats {
  likes: number;
  comments: number;
  views: number;
}

export interface Article {
  id: number;
  author: ArticleAuthor;
  publishedAt: string;
  images: string[];
  sport: string;
  sportName: string;
  tags: string[];
  title: string;
  description: string;
  stats: ArticleStats;
  liked: boolean;
  commentsOpen: boolean;
}
