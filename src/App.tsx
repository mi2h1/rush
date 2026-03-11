import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ArticleCard } from './components/ArticleCard';
import { fetchArticles } from './lib/appwrite';
import { isToday } from './lib/time';
import type { Article, CategoryId } from './types';
import './App.css';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchArticles(activeCategory)
      .then(setArticles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const hotArticles = useMemo(() => articles.filter((a) => a.isHot), [articles]);
  const todayArticles = useMemo(
    () => articles.filter((a) => !a.isHot && isToday(a.publishedAt)),
    [articles],
  );
  const recentArticles = useMemo(
    () => articles.filter((a) => !a.isHot && !isToday(a.publishedAt)),
    [articles],
  );

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

        {!loading && !error && (
          <>
            {hotArticles.length > 0 && (
              <section className="section">
                <h2 className="section-title">
                  <span className="hot-icon">🔥</span> ホットニュース
                </h2>
                <div className="hot-grid">
                  {hotArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} featured />
                  ))}
                </div>
              </section>
            )}

            <div className="lower-grid">
              {todayArticles.length > 0 && (
                <section className="section">
                  <h2 className="section-title">今日の話題</h2>
                  <div className="article-list">
                    {todayArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}

              {recentArticles.length > 0 && (
                <section className="section">
                  <h2 className="section-title">最新記事</h2>
                  <div className="article-list">
                    {recentArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
