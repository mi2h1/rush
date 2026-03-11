import type { Article } from '../types';

/** Qiita人気記事をブラウザから直接取得 (LGTM数順) */
export async function fetchQiitaPopular(count = 5): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://qiita.com/api/v2/items?query=tag:AI&per_page=${count}&sort=stock`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? []).map((a: any) => ({
      id: a.id ?? '',
      title: a.title ?? '',
      source: 'Qiita' as const,
      category: 'other' as const,
      publishedAt: a.created_at ?? new Date().toISOString(),
      summary: a.title ?? '',
      tags: [],
      url: a.url ?? '',
      thumbnailUrl: undefined,
    }));
  } catch {
    return [];
  }
}

/** Zenn週間人気記事をブラウザから直接取得 */
export async function fetchZennWeekly(count = 5): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://zenn.dev/api/articles?order=weekly&topic_slug=ai&count=${count}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.articles ?? []).map((a: any) => ({
      id: String(a.id),
      title: a.title ?? '',
      source: 'Zenn' as const,
      category: 'other' as const,
      publishedAt: a.published_at ?? new Date().toISOString(),
      summary: a.title ?? '',
      tags: [],
      url: `https://zenn.dev${a.path}`,
      thumbnailUrl: a.og_image_url ?? undefined,
    }));
  } catch {
    return [];
  }
}
