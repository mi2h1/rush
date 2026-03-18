import type { Article } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';
import { BookmarkButton } from './BookmarkButton';

const CATEGORY_LABEL: Record<string, string> = {
  openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google', meta: 'Meta', other: 'その他',
};

const CATEGORY_BADGE: Record<string, string> = {
  openai:    'bg-primary-50 text-primary-700',
  anthropic: 'bg-amber-50 text-amber-700',
  google:    'bg-sky-50 text-sky-700',
  meta:      'bg-indigo-50 text-indigo-700',
  other:     'bg-slate-100 text-slate-700',
};

const SOURCE_ICON: Record<string, string> = {
  Zenn:  'https://cdn.simpleicons.org/zenn/3ea8ff',
  Qiita: 'https://cdn.simpleicons.org/qiita/55c500',
  note:  'https://cdn.simpleicons.org/note/41c9b4',
};

export function GridCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full hover:shadow-md transition-shadow duration-200 rounded-xl"
    >
      <article className="h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-hidden bg-slate-100">
          <Thumbnail url={article.thumbnailUrl} category={article.category} source={article.source} size="large" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BADGE[article.category] ?? 'bg-slate-100 text-slate-700'}`}>
              {CATEGORY_LABEL[article.category] ?? article.category}
            </span>
            {SOURCE_ICON[article.source] && (
              <img src={SOURCE_ICON[article.source]} alt={article.source} className="w-3.5 h-3.5 opacity-60" />
            )}
          </div>
          <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{article.title}</p>
          <p className="mt-1.5 text-xs text-body line-clamp-2">{article.summary}</p>
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(article.tags ?? []).slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-primary-500 opacity-80">#{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">{formatRelativeTime(article.publishedAt)}</span>
              <BookmarkButton articleId={article.id} />
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
