import { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { ZennColumn, QiitaColumn } from './components/ServiceColumns';
import { HotSection } from './components/HotSection';
import { XTimeline } from './components/XTimeline';
import { ArticleListPage } from './components/ArticleListPage';
import { AdminPage } from './components/AdminPage';
import { BookmarksPage } from './components/BookmarksPage';
import { AuthProvider } from './context/AuthContext';
import { fetchTopArticles, fetchXArticles, fetchXUsers } from './lib/supabase';
import { formatRelativeTime } from './lib/time';
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const onPop = () => setPage(getPageFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
      .then(([fetched, users]) => {
        setXArticles(fetched);
        setXDisplayNames(new Map(users.filter(u => u.displayName).map(u => [u.username, u.displayName!])));
      })
      .catch(() => setXArticles([]))
      .finally(() => setXLoading(false));
  }, []);

  const heroArticles = useMemo(() => articles.slice(0, 5), [articles]);
  const hotArticles = useMemo(() => articles.filter((a) => a.isHot), [articles]);
  const lastUpdated = articles[0]?.publishedAt
    ? formatRelativeTime(articles[0].publishedAt)
    : undefined;

  return (
    <AuthProvider>
      <Layout
        header={
          <Header
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(d => !d)}
            lastUpdated={lastUpdated}
          />
        }
        sidebar={
          <Sidebar active={page} onNavigate={handlePageChange} />
        }
      >
        <div className="px-8 py-6 max-w-7xl mx-auto">
          {page === 'top' && (
            <>
              {loading && (
                <div className="text-center py-16 text-slate-500 text-base">読み込み中...</div>
              )}
              {!loading && (
                <div className="flex flex-col gap-8">
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
        </div>
      </Layout>
    </AuthProvider>
  );
}
