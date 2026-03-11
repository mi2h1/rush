import { type Article, type CategoryId } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';

const COLUMNS: { id: Exclude<CategoryId, 'all' | 'other' | 'meta'>; label: string }[] = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'google', label: 'Google' },
];

const SOURCE_ICON: Record<string, string> = {
  Zenn: 'https://cdn.simpleicons.org/zenn/3ea8ff',
  Qiita: 'https://cdn.simpleicons.org/qiita/55c500',
  note: 'https://cdn.simpleicons.org/note/41c9b4',
};

interface Props {
  articles: Article[];
}

export function ColumnCard({ article }: { article: Article }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="column-card">
      <Thumbnail url={article.thumbnailUrl} category={article.category} source={article.source} size="small" />
      <div className="column-card-body">
        <p className="column-card-title">{article.title}</p>
        <span className="card-time">{formatRelativeTime(article.publishedAt)}</span>
      </div>
      {SOURCE_ICON[article.source] && (
        <img src={SOURCE_ICON[article.source]} alt={article.source} className="source-icon" />
      )}
    </a>
  );
}

export function CategoryColumns({ articles }: Props) {
  return (
    <section className="section">
      <h2 className="section-title">カテゴリ別</h2>
      <div className="category-columns">
        {COLUMNS.map(({ id, label }) => {
          const items = articles.filter((a) => a.category === id).slice(0, 5);
          return (
            <div key={id} className="category-column">
              <h3 className={`column-heading cat-${id}`}>{label}</h3>
              <div className="column-cards">
                {items.length > 0
                  ? items.map((a) => <ColumnCard key={a.id} article={a} />)
                  : <p className="column-empty">記事なし</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
