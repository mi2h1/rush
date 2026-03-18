import { type Article } from '../types';
import { formatRelativeTime } from '../lib/time';

interface Props {
  articles: Article[];
  loading?: boolean;
  displayNames?: Map<string, string>;
}

function XPost({ article, displayNames }: { article: Article; displayNames?: Map<string, string> }) {
  const username = article.authorUsername
    ?? article.url.match(/x\.com\/([^/]+)\/status/)?.[1];
  const displayName = username ? displayNames?.get(username) : undefined;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-3 border-b border-slate-100 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
    >
      {username && (
        <div className="flex items-baseline gap-1.5 mb-1">
          {displayName && (
            <span className="text-sm font-semibold text-slate-900">{displayName}</span>
          )}
          <span className="text-xs text-slate-400">@{username}</span>
        </div>
      )}
      <p className="text-sm text-body leading-relaxed line-clamp-4">{article.summary || article.title}</p>
      {article.thumbnailUrl && (
        <img src={article.thumbnailUrl} alt="" className="mt-2 w-full max-h-40 object-cover rounded-lg" loading="lazy" />
      )}
      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-primary-500 opacity-80">#{tag}</span>
        ))}
        <span className="text-xs text-slate-400 ml-auto">{formatRelativeTime(article.publishedAt)}</span>
      </div>
    </a>
  );
}

export function XTimeline({ articles, loading, displayNames }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <img src="https://cdn.simpleicons.org/x/334155" alt="X" width={12} height={12} />
          タイムライン
        </h3>
        {articles[0]?.publishedAt && (
          <span className="text-xs text-slate-400">{formatRelativeTime(articles[0].publishedAt)}</span>
        )}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto flex-1" style={{ maxHeight: '600px' }}>
          {loading && (
            <div role="status" className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-slate-500 mt-2">読み込み中...</p>
              <span className="sr-only">読み込み中</span>
            </div>
          )}
          {!loading && articles.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-12">ポストがありません</p>
          )}
          {articles.map((a) => (
            <XPost key={a.id} article={a} displayNames={displayNames} />
          ))}
        </div>
      </div>
    </div>
  );
}
