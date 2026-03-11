import { type Article } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';

const CATEGORY_LABEL: Record<string, string> = {
  openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google',
  meta: 'Meta', other: 'その他',
};

const SOURCE_ICON: Record<string, string> = {
  Zenn: 'https://cdn.simpleicons.org/zenn/3ea8ff',
  Qiita: 'https://cdn.simpleicons.org/qiita/55c500',
  note: 'https://cdn.simpleicons.org/note/41c9b4',
};

interface Props {
  articles: Article[];
}

export function HotSection({ articles }: Props) {
  if (articles.length === 0) return null;
  return (
    <section className="section">
      <h2 className="section-title"><span className="hot-icon">🔥</span> 注目記事</h2>
      <div className="hot-grid">
        {articles.slice(0, 6).map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hot-card article-card`}
            data-category={article.category}
          >
            <Thumbnail url={article.thumbnailUrl} category={article.category} size="large" />
            <div className="hot-card-body">
              <div className="card-header">
                <span className={`category-badge cat-${article.category}`}>
                  {CATEGORY_LABEL[article.category]}
                </span>
              </div>
              <p className="hot-card-title">{article.title}</p>
              <p className="card-summary">{article.summary}</p>
              <div className="card-footer">
                <div className="card-tags">
                  {(article.tags ?? []).slice(0, 2).map((tag) => (
                    <span key={tag} className="card-tag">#{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {SOURCE_ICON[article.source] && (
                    <img src={SOURCE_ICON[article.source]} alt={article.source} className="source-icon" />
                  )}
                  <span className="card-time">{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
