import type { Article } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';
import { BookmarkButton } from './BookmarkButton';

const CATEGORY_LABEL: Record<string, string> = {
  openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google', other: 'その他',
};

/** hot-cardデザインで上辺カテゴリボーダー付きカード。グリッド表示用 */
export function GridCard({ article }: { article: Article }) {
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
        <div className="card-header">
          <span className={`category-badge cat-${article.category}`}>
            {CATEGORY_LABEL[article.category] ?? article.category}
          </span>
          <span className={`source-badge ${article.source.toLowerCase()}`}>{article.source}</span>
          <BookmarkButton articleId={article.id} />
        </div>
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
