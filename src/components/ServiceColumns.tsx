import { useState, useEffect } from 'react';
import type { Article } from '../types';
import { fetchSourceLatest } from '../lib/appwrite';
import { fetchZennWeekly, fetchQiitaPopular } from '../lib/trending';
import { ColumnCard } from './CategoryColumns';

interface ColumnProps {
  title: string;
  badge: string;
  articles: Article[];
  loading: boolean;
}

function ServiceColumn({ title, badge, articles, loading }: ColumnProps) {
  return (
    <div className="category-column">
      <div className="service-column-header">
        <h3 className="column-heading">{title}</h3>
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

export function ServiceColumns() {
  const [zenn, setZenn] = useState<Article[]>([]);
  const [qiita, setQiita] = useState<Article[]>([]);
  const [note, setNote] = useState<Article[]>([]);
  const [zennLoading, setZennLoading] = useState(true);
  const [qiitaLoading, setQiitaLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(true);

  useEffect(() => {
    fetchZennWeekly(5).then(setZenn).finally(() => setZennLoading(false));
    fetchQiitaPopular(5).then(setQiita).finally(() => setQiitaLoading(false));
    fetchSourceLatest('note', 5).then(setNote).finally(() => setNoteLoading(false));
  }, []);

  return (
    <section className="section">
      <h2 className="section-title">サービス別</h2>
      <div className="category-columns">
        <ServiceColumn title="Zenn" badge="週間人気5件" articles={zenn} loading={zennLoading} />
        <ServiceColumn title="Qiita" badge="人気5件" articles={qiita} loading={qiitaLoading} />
        <ServiceColumn title="note" badge="最新5件" articles={note} loading={noteLoading} />
      </div>
    </section>
  );
}
