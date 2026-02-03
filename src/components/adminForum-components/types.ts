export type PostStatus = 'Published' | 'Draft' | 'Reported';

export interface ForumPost {
  id: string;
  title: string;
  category: string;
  comments: number;
  authorName: string;
  authorInitials: string;
  tags: string[];
  status: PostStatus;
  date: string;
}