export type CategoryId = 'all' | 'openai' | 'anthropic' | 'google' | 'meta' | 'other';
export type Source = 'Zenn' | 'note' | 'Qiita' | 'X';

export interface Article {
  id: string;
  title: string;
  source: Source;
  category: Exclude<CategoryId, 'all'>;
  publishedAt: string; // ISO8601
  summary: string;
  tags: string[];
  url: string;
  isHot?: boolean;
  thumbnailUrl?: string;
  authorUsername?: string;
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'google', label: 'Google' },
  { id: 'other', label: 'その他' },
];

export type PageId = 'top' | 'articles';

export const SOURCES: { id: string; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'Zenn', label: 'Zenn' },
  { id: 'Qiita', label: 'Qiita' },
  { id: 'note', label: 'note' },
];
