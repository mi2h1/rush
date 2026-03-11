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
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'google', label: 'Google' },
  { id: 'other', label: 'その他' },
];
