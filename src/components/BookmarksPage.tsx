import { useState, useEffect } from 'react';
import { fetchBookmarkedArticles } from '../lib/supabase';
import { GridCard } from './GridCard';
import { SkeletonGrid } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import type { Article } from '../types';

export function BookmarksPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarkedArticles().then(setArticles).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">ブックマーク</h2>
      {loading ? (
        <SkeletonGrid count={6} />
      ) : articles.length === 0 ? (
        <EmptyState message="ブックマークはありません" description="記事のブックマークボタンから追加できます" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => <GridCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
