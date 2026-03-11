import { useState, useEffect, useCallback } from 'react';
import type { Article } from '../types';
import { CATEGORIES, SOURCES } from '../types';
import { fetchArticleList } from '../lib/supabase';
import { GridCard } from './GridCard';

const PER_PAGE = 20;

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`filter-chip ${active ? 'active' : ''}`} onClick={onClick}>
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
    <div className="pagination">
      <button className="pagination-btn" onClick={() => onChange(page - 1)} disabled={page === 0}>←</button>
      {pageNums.map((p) => (
        <button
          key={p}
          className={`pagination-btn ${page === p ? 'active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}
      <button className="pagination-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages - 1}>→</button>
      <span className="pagination-info">{total}件 / {totalPages}ページ</span>
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
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">ソース</span>
          {SOURCES.map((s) => (
            <FilterChip key={s.id} label={s.label} active={sourceFilter === s.id} onClick={() => handleSource(s.id)} />
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">AI種別</span>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} label={c.label} active={categoryFilter === c.id} onClick={() => handleCategory(c.id)} />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="state-message">読み込み中...</div>
      ) : articles.length === 0 ? (
        <div className="state-message">記事が見つかりませんでした</div>
      ) : (
        <>
          <div className="article-list-grid">
            {articles.map((a) => <GridCard key={a.id} article={a} />)}
          </div>
          <Pagination page={page} total={total} onChange={setPage} />
        </>
      )}
    </div>
  );
}
