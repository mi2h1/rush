import { type Article } from '../types';
import { formatRelativeTime } from '../lib/time';

interface Props {
  articles: Article[];
  loading?: boolean;
}

function XPost({ article }: { article: Article }) {
  const username = article.authorUsername
    ?? article.url.match(/x\.com\/([^/]+)\/status/)?.[1];
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="x-post"
    >
      {username && (
        <div className="x-post-author">
          <span className="x-post-author-name">@{username}</span>
        </div>
      )}
      <p className="x-post-text">{article.summary || article.title}</p>
      {article.thumbnailUrl && (
        <img src={article.thumbnailUrl} alt="" className="x-post-image" loading="lazy" />
      )}
      <div className="x-post-footer">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="x-post-tag">#{tag}</span>
        ))}
        <span className="card-time" style={{ marginLeft: 'auto' }}>
          {formatRelativeTime(article.publishedAt)}
        </span>
      </div>
    </a>
  );
}

export function XTimeline({ articles, loading }: Props) {
  const lastFetched = articles[0]?.publishedAt;
  return (
    <div className="x-timeline-wrapper">
      <div className="service-column-header">
        <h3 className="column-heading x-column-heading">
          <img src="https://cdn.simpleicons.org/x/e7e9ea" alt="X" width={12} height={12} className="x-heading-icon" />
          タイムライン
        </h3>
        {lastFetched && <span className="column-badge">{formatRelativeTime(lastFetched)}</span>}
      </div>
      <div className="x-timeline">
        <div className="x-timeline-body">
          {loading && <div className="x-timeline-state">読み込み中...</div>}
          {!loading && articles.length === 0 && (
            <div className="x-timeline-state">ポストがありません</div>
          )}
          {articles.map((a) => (
            <XPost key={a.id} article={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
