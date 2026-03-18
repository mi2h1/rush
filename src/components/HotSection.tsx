import { type Article } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';
import { BookmarkButton } from './BookmarkButton';

const CATEGORY_LABEL: Record<string, string> = {
  openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google',
  meta: 'Meta', other: 'その他',
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

interface Props {
  articles: Article[];
}

export function HotSection({ articles }: Props) {
  if (articles.length === 0) return null;
  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">注目記事</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, 6).map((article) => (
          <a
            key={article.id}
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
                <div className="mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BADGE[article.category] ?? 'bg-slate-100 text-slate-700'}`}>
                    {CATEGORY_LABEL[article.category] ?? article.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{article.title}</p>
                <p className="mt-1.5 text-xs text-body line-clamp-2">{article.summary}</p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatRelativeTime(article.publishedAt)}</span>
                  <div className="flex items-center gap-1.5">
                    {SOURCE_ICON[article.source] && (
                      <img src={SOURCE_ICON[article.source]} alt={article.source} className="w-3.5 h-3.5 opacity-60" />
                    )}
                    <BookmarkButton articleId={article.id} />
                  </div>
                </div>
              </div>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
