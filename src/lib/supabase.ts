import { createClient } from '@supabase/supabase-js';
import type { Article, XUser } from '../types/index';

export const supabase = createClient(
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
    authorUsername: row.author_username ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapXUser(row: any): XUser {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name ?? null,
    profileImageUrl: row.profile_image_url ?? null,
    enabled: row.enabled,
    createdAt: row.created_at,
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

// ── Auth ────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function onAuthStateChange(cb: (session: boolean) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => cb(!!session));
}

// ── Bookmarks ────────────────────────────────────────────
export async function fetchBookmarkedIds(): Promise<string[]> {
  const { data } = await supabase.from('bookmarks').select('article_id');
  return (data ?? []).map((r) => r.article_id);
}

export async function addBookmark(articleId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('bookmarks').insert({ article_id: articleId, user_id: user.id });
}

export async function removeBookmark(articleId: string): Promise<void> {
  await supabase.from('bookmarks').delete().eq('article_id', articleId);
}

export async function fetchBookmarkedArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from('bookmarks')
    .select('articles!inner(*)')
    .order('created_at', { ascending: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => mapRow(r.articles));
}

// ── x_users CRUD ────────────────────────────────────────
export async function fetchXUsers(): Promise<XUser[]> {
  const { data } = await supabase
    .from('x_users')
    .select('*')
    .order('created_at', { ascending: true });
  return (data ?? []).map(mapXUser);
}

export async function addXUser(username: string, displayName?: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('x_users')
    .insert({ username, display_name: displayName ?? null });
  return { error: error?.message ?? null };
}

export async function updateXUser(id: string, data: { enabled?: boolean; displayName?: string }): Promise<void> {
  const update: Record<string, unknown> = {};
  if (data.enabled !== undefined) update.enabled = data.enabled;
  if (data.displayName !== undefined) update.display_name = data.displayName;
  await supabase.from('x_users').update(update).eq('id', id);
}

export async function deleteXUser(id: string): Promise<void> {
  await supabase.from('x_users').delete().eq('id', id);
}
