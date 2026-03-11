import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageNav } from './components/PageNav';
import { HeroSection } from './components/HeroSection';
import { ZennColumn, QiitaColumn } from './components/ServiceColumns';
import { HotSection } from './components/HotSection';
import { XTimeline } from './components/XTimeline';
import { ArticleListPage } from './components/ArticleListPage';
import { AdminPage } from './components/AdminPage';
import { BookmarksPage } from './components/BookmarksPage';
import { AuthProvider } from './context/AuthContext';
import { fetchTopArticles, fetchXArticles, fetchXUsers } from './lib/supabase';
import type { Article, PageId } from './types';
import './App.css';

const BASE = '/rush/';

function getPageFromUrl(): PageId {
  const pathname = window.location.pathname;
  if (pathname.endsWith('/admin')) return 'admin';
  if (pathname.endsWith('/bookmarks')) return 'bookmarks';
  const p = new URLSearchParams(window.location.search).get('p');
  return p === 'articles' ? 'articles' : 'top';
}

export default function App() {
  const [page, setPage] = useState<PageId>(getPageFromUrl);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [xArticles, setXArticles] = useState<Article[]>([]);
  const [xLoading, setXLoading] = useState(true);
  const [xDisplayNames, setXDisplayNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const onPop = () => setPage(getPageFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handlePageChange = useCallback((p: PageId) => {
    setPage(p);
    if (p === 'admin') history.pushState(null, '', BASE + 'admin');
    else if (p === 'bookmarks') history.pushState(null, '', BASE + 'bookmarks');
    else history.pushState(null, '', BASE + (p === 'top' ? '' : `?p=${p}`));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTopArticles(100).then(setArticles).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setXLoading(true);
    Promise.all([fetchXArticles(30), fetchXUsers()])
      .then(([articles, users]) => {
        setXArticles(articles);
        setXDisplayNames(new Map(users.filter(u => u.displayName).map(u => [u.username, u.displayName!])));
      })
      .catch(() => setXArticles([]))
      .finally(() => setXLoading(false));
  }, []);

  const heroArticles = useMemo(() => articles.slice(0, 5), [articles]);
  const hotArticles = useMemo(() => articles.filter((a) => a.isHot), [articles]);

  return (
    <AuthProvider>
      <div className="app">
        <Header onNavigate={handlePageChange} />
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
                      <XTimeline articles={xArticles} loading={xLoading} displayNames={xDisplayNames} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {page === 'articles' && <ArticleListPage />}
          {page === 'bookmarks' && <BookmarksPage />}
          {page === 'admin' && <AdminPage />}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
