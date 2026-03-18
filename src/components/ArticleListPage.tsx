import { useState, useEffect, useCallback } from 'react';
import type { Article } from '../types';
import { CATEGORIES, SOURCES } from '../types';
import { fetchArticleList } from '../lib/supabase';
import { GridCard } from './GridCard';
import { SkeletonGrid } from './SkeletonCard';
import { EmptyState } from './EmptyState';

const PER_PAGE = 20;

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
        active
          ? 'bg-primary-500 text-white border-primary-500'
          : 'bg-white text-slate-600 border-slate-300 hover:border-primary-400 hover:text-primary-600'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / PER_PAGE);
  if (totalPages <= 1) return null;

  const start = Math.max(0, Math.min(page - 2, totalPages - 5));
  const pageNums = Array.from({ length: Math.min(5, totalPages - start) }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
      <button
        className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
      >
        ←
      </button>
      {pageNums.map((p) => (
        <button
          key={p}
          className={`w-10 h-10 inline-flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
            page === p
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-gray-50'
          }`}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}
      <button
        className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages - 1}
      >
        →
      </button>
      <span className="text-xs text-slate-400 ml-2">{total}件 / {totalPages}ページ</span>
    </div>
  );
}

export function ArticleListPage() {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchArticleList({
      source: sourceFilter !== 'all' ? sourceFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      page,
      limit: PER_PAGE,
    }).then(({ articles, total }) => {
      setArticles(articles);
      setTotal(total);
    }).finally(() => setLoading(false));
  }, [sourceFilter, categoryFilter, page]);

  const handleSource = useCallback((s: string) => { setSourceFilter(s); setPage(0); }, []);
  const handleCategory = useCallback((c: string) => { setCategoryFilter(c); setPage(0); }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500 w-12">ソース</span>
          {SOURCES.map((s) => (
            <FilterChip key={s.id} label={s.label} active={sourceFilter === s.id} onClick={() => handleSource(s.id)} />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500 w-12">AI種別</span>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} label={c.label} active={categoryFilter === c.id} onClick={() => handleCategory(c.id)} />
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : articles.length === 0 ? (
        <EmptyState message="記事が見つかりませんでした" description="フィルター条件を変えてみてください" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((a) => <GridCard key={a.id} article={a} />)}
          </div>
          <Pagination page={page} total={total} onChange={setPage} />
        </>
      )}
    </div>
  );
}
