import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ArticleCard } from './components/ArticleCard';
import { mockArticles } from './data/mockArticles';
import { isToday } from './lib/time';
import type { CategoryId } from './types';
import './App.css';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? mockArticles
        : mockArticles.filter((a) => a.category === activeCategory),
    [activeCategory],
  );

  const hotArticles = filtered.filter((a) => a.isHot);
  const todayArticles = filtered.filter((a) => !a.isHot && isToday(a.publishedAt));
  const recentArticles = filtered.filter((a) => !a.isHot && !isToday(a.publishedAt));

  return (
    <div className="app">
      <Header />
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <main className="main-content">
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
      </main>
    </div>
  );
}
