import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ArticleCard } from './components/ArticleCard';
import { HeroSection } from './components/HeroSection';
import { CategoryColumns, ColumnCard } from './components/CategoryColumns';
import { HotSection } from './components/HotSection';
import { fetchArticles, fetchXArticles } from './lib/appwrite';
import { XTimeline } from './components/XTimeline';
import { isToday } from './lib/time';
import type { Article, CategoryId } from './types';
import './App.css';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
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
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

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
              {articles.map((a) => <ColumnCard key={a.id} article={a} />)}
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
