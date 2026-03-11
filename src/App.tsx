import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ArticleCard } from './components/ArticleCard';
import { HeroSection } from './components/HeroSection';
import { CategoryColumns } from './components/CategoryColumns';
import { HotSection } from './components/HotSection';
import { fetchArticles, fetchXArticles } from './lib/appwrite';
import { XTimeline } from './components/XTimeline';
import { Thumbnail } from './components/Thumbnail';
import { isToday } from './lib/time';
import { formatRelativeTime } from './lib/time';
import type { Article, CategoryId } from './types';
import { CATEGORIES } from './types';
import './App.css';

const VALID_IDS = new Set(CATEGORIES.map((c) => c.id));

function getCategoryFromUrl(): CategoryId {
  const c = new URLSearchParams(window.location.search).get('c');
  return VALID_IDS.has(c as CategoryId) ? (c as CategoryId) : 'all';
}

function OtherCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="other-card"
      data-category={article.category}
    >
      <Thumbnail url={article.thumbnailUrl} category={article.category} source={article.source} size="large" />
      <div className="hot-card-body">
        <p className="hot-card-title">{article.title}</p>
        <p className="card-summary">{article.summary}</p>
        <div className="card-footer">
          <div className="card-tags">
            {(article.tags ?? []).slice(0, 2).map((tag) => (
              <span key={tag} className="card-tag">#{tag}</span>
            ))}
          </div>
          <span className="card-time">{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>(getCategoryFromUrl);
  const [xArticles, setXArticles] = useState<Article[]>([]);
  const [xLoading, setXLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchArticles(activeCategory)
      .then(setArticles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  // ブラウザ戻る/進む対応
  useEffect(() => {
    const onPop = () => setActiveCategory(getCategoryFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleCategoryChange = useCallback((cat: CategoryId) => {
    setActiveCategory(cat);
    const search = cat === 'all' ? '' : `?c=${cat}`;
    history.pushState(null, '', window.location.pathname + search);
  }, []);

  useEffect(() => {
    setXLoading(true);
    fetchXArticles(30)
      .then(setXArticles)
      .catch(() => setXArticles([]))
      .finally(() => setXLoading(false));
  }, []);

  // all表示: ヒーロー + カテゴリ列 + 注目
  const heroArticles = useMemo(() => articles.slice(0, 5), [articles]);
  const hotArticles = useMemo(() => articles.filter((a) => a.isHot), [articles]);

  // カテゴリ絞り込み表示: 今日の話題 + 最新記事
  const todayArticles = useMemo(
    () => articles.filter((a) => isToday(a.publishedAt)),
    [articles],
  );
  const recentArticles = useMemo(
    () => articles.filter((a) => !isToday(a.publishedAt)),
    [articles],
  );

  const isAllView = activeCategory === 'all';
  const isOtherView = activeCategory === 'other';

  return (
    <div className="app">
      <Header />
      <CategoryTabs active={activeCategory} onChange={handleCategoryChange} />

      <main className="main-content">
        {loading && <div className="state-message">読み込み中...</div>}
        {error && <div className="state-message error">エラー: {error}</div>}

        {!loading && !error && articles.length === 0 && (
          <div className="state-message">記事がありません</div>
        )}

        {!loading && !error && isAllView && (
          <div className="main-columns">
            <div className="main-left">
              <HeroSection articles={heroArticles} />
              <CategoryColumns articles={articles} />
              <HotSection articles={hotArticles} />
            </div>
            <XTimeline articles={xArticles} loading={xLoading} />
          </div>
        )}

        {!loading && !error && !isAllView && isOtherView && (
          <section className="section">
            <h2 className="section-title">その他</h2>
            <div className="other-grid">
              {articles.map((a) => <OtherCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {!loading && !error && !isAllView && !isOtherView && (
          <div className="lower-grid">
            {todayArticles.length > 0 && (
              <section className="section">
                <h2 className="section-title">今日の話題</h2>
                <div className="article-list">
                  {todayArticles.map((a) => <ArticleCard key={a.id} article={a} />)}
                </div>
              </section>
            )}
            {recentArticles.length > 0 && (
              <section className="section">
                <h2 className="section-title">最新記事</h2>
                <div className="article-list">
                  {recentArticles.map((a) => <ArticleCard key={a.id} article={a} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
