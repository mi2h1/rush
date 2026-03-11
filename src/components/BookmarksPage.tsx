import { useState, useEffect } from 'react';
import { fetchBookmarkedArticles } from '../lib/supabase';
import { GridCard } from './GridCard';
import type { Article } from '../types';

export function BookmarksPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarkedArticles().then(setArticles).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '16px' }}>ブックマーク</h2>
      {loading && <div className="state-message">読み込み中...</div>}
      {!loading && articles.length === 0 && (
        <div className="state-message">ブックマークはありません</div>
      )}
      {!loading && articles.length > 0 && (
        <div className="articles-grid">
          {articles.map((a) => <GridCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
