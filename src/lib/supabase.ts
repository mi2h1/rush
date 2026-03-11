import { createClient } from '@supabase/supabase-js';
import type { Article } from '../types/index';

const supabase = createClient(
  'https://ongmiknsyvyqlbwjvknb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ21pa25zeXZ5cWxid2p2a25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzQ4NDcsImV4cCI6MjA4ODgxMDg0N30.NVTxNspCluNLdwPxvmK7Vq6MP-QQbfmIcwnl1Cg4MLc'
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    source: row.source,
    category: row.category,
    publishedAt: row.published_at,
    summary: row.summary,
    tags: row.tags ?? [],
    url: row.url,
    isHot: row.is_hot ?? false,
    thumbnailUrl: row.thumbnail_url ?? undefined,
  };
}

export async function fetchXArticles(limit = 30): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('source', 'X')
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapRow);
}

export async function fetchTopArticles(limit = 100): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .neq('source', 'X')
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapRow);
}

export async function fetchSourceLatest(source: string, limit = 5): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('source', source)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapRow);
}

export async function fetchArticleList(opts: {
  source?: string;
  category?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ articles: Article[]; total: number }> {
  const { source, category, page = 0, limit = 20 } = opts;
  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .neq('source', 'X')
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  if (source) query = query.eq('source', source);
  if (category) query = query.eq('category', category);
  const { data, count } = await query;
  return { articles: (data ?? []).map(mapRow), total: count ?? 0 };
}
