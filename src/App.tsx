import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { PageNav } from './components/PageNav';
import { HeroSection } from './components/HeroSection';
import { ZennColumn, QiitaColumn } from './components/ServiceColumns';
import { HotSection } from './components/HotSection';
import { XTimeline } from './components/XTimeline';
import { ArticleListPage } from './components/ArticleListPage';
import { fetchTopArticles, fetchXArticles } from './lib/appwrite';
import type { Article, PageId } from './types';
import './App.css';

function getPageFromUrl(): PageId {
  const p = new URLSearchParams(window.location.search).get('p');
  return p === 'articles' ? 'articles' : 'top';
}

export default function App() {
  const [page, setPage] = useState<PageId>(getPageFromUrl);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [xArticles, setXArticles] = useState<Article[]>([]);
  const [xLoading, setXLoading] = useState(true);

  // ブラウザ戻る/進む対応
  useEffect(() => {
    const onPop = () => setPage(getPageFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handlePageChange = useCallback((p: PageId) => {
    setPage(p);
    const search = p === 'top' ? '' : `?p=${p}`;
    history.pushState(null, '', window.location.pathname + search);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTopArticles(100).then(setArticles).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setXLoading(true);
    fetchXArticles(30)
      .then(setXArticles)
      .catch(() => setXArticles([]))
      .finally(() => setXLoading(false));
  }, []);

  const heroArticles = useMemo(() => articles.slice(0, 5), [articles]);
  const hotArticles = useMemo(() => articles.filter((a) => a.isHot), [articles]);

  return (
    <div className="app">
      <Header />
      <PageNav active={page} onChange={handlePageChange} />

      <main className="main-content">
        {page === 'top' && (
          <>
            {loading && <div className="state-message">読み込み中...</div>}
            {!loading && (
              <div className="top-layout">
                <HeroSection articles={heroArticles} />
                <div className="top-body">
                  <div className="top-left">
                    <div className="top-services">
                      <ZennColumn />
                      <QiitaColumn />
                    </div>
                    <HotSection articles={hotArticles} />
                  </div>
                  <div className="top-right">
                    <XTimeline articles={xArticles} loading={xLoading} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {page === 'articles' && <ArticleListPage />}
      </main>
    </div>
  );
}
