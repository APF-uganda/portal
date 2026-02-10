export type ArticleStatus = 'Published' | 'Draft' | 'Scheduled';
export type Category = 'News' | 'Update' | 'Announcement';

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  status: ArticleStatus;
  publishDate: string | null;
  views: string;
}