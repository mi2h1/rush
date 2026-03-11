import { useState, useEffect } from 'react';
import type { Article } from '../types';
import { fetchSourceLatest } from '../lib/appwrite';
import { fetchQiitaPopular } from '../lib/trending';
import { ColumnCard } from './CategoryColumns';

interface ColumnProps {
  title: string;
  badge: string;
  articles: Article[];
  loading: boolean;
  colorClass?: string;
}

function ServiceColumn({ title, badge, articles, loading, colorClass }: ColumnProps) {
  return (
    <div className="category-column">
      <div className="service-column-header">
        <h3 className={`column-heading${colorClass ? ` ${colorClass}` : ''}`}>{title}</h3>
        <span className="column-badge">{badge}</span>
      </div>
      <div className="column-cards">
        {loading ? (
          <p className="column-empty">読み込み中...</p>
        ) : articles.length > 0 ? (
          articles.map((a) => <ColumnCard key={a.id} article={a} />)
        ) : (
          <p className="column-empty">記事なし</p>
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
  return <ServiceColumn title="Zenn" badge="最新5件" articles={articles} loading={loading} colorClass="col-zenn" />;
}

export function QiitaColumn() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchQiitaPopular(5).then(setArticles).finally(() => setLoading(false));
  }, []);
  return <ServiceColumn title="Qiita" badge="人気5件" articles={articles} loading={loading} colorClass="col-qiita" />;
}
