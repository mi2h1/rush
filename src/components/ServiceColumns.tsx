import { useState, useEffect } from 'react';
import type { Article } from '../types';
import { fetchSourceLatest } from '../lib/supabase';
import { fetchQiitaPopular } from '../lib/trending';
import { formatRelativeTime } from '../lib/time';

interface ColumnProps {
  title: string;
  badge: string;
  articles: Article[];
  loading: boolean;
}

function ServiceColumn({ title, badge, articles, loading }: ColumnProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="text-xs text-slate-400">{badge}</span>
      </div>
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} aria-busy="true" role="status" className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2">
              <div className="h-3.5 bg-slate-200 rounded-md w-full skeleton-pulse" />
              <div className="h-3.5 bg-slate-200 rounded-md w-3/4 skeleton-pulse" />
              <div className="h-3 bg-slate-200 rounded-md w-1/4 skeleton-pulse" />
            </div>
          ))
        ) : articles.length > 0 ? (
          articles.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-slate-200 shadow-sm p-3 hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-sm font-medium text-slate-900 line-clamp-2 leading-snug">{a.title}</p>
              <p className="mt-1.5 text-xs text-slate-500">{formatRelativeTime(a.publishedAt)}</p>
            </a>
          ))
        ) : (
          <p className="text-sm text-slate-400 py-4 text-center">記事なし</p>
        )}
      </div>
    </div>
  );
}

export function ZennColumn() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSourceLatest('Zenn', 5).then(setArticles).finally(() => setLoading(false));
  }, []);
  return <ServiceColumn title="Zenn" badge="最新5件" articles={articles} loading={loading} />;
}

export function QiitaColumn() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchQiitaPopular(5).then(setArticles).finally(() => setLoading(false));
  }, []);
  return <ServiceColumn title="Qiita" badge="人気5件" articles={articles} loading={loading} />;
}
