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

function HeroMainCard({ article }: { article: Article }) {
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
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_BADGE[article.category] ?? 'bg-slate-100 text-slate-700'}`}>
              {CATEGORY_LABEL[article.category] ?? article.category}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 line-clamp-2 leading-snug">
            {article.title}
          </h2>
          <p className="mt-2 text-sm text-body line-clamp-3">{article.summary}</p>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">{formatRelativeTime(article.publishedAt)}</span>
            <div className="flex items-center gap-2">
              {SOURCE_ICON[article.source] && (
                <img src={SOURCE_ICON[article.source]} alt={article.source} className="w-4 h-4 opacity-60" />
              )}
              <BookmarkButton articleId={article.id} />
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}

function HeroSideCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:shadow-md transition-shadow duration-200 rounded-xl"
    >
      <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex gap-3 p-3">
        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <Thumbnail url={article.thumbnailUrl} category={article.category} source={article.source} size="small" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <p className="text-sm font-medium text-slate-900 line-clamp-2 leading-snug">{article.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BADGE[article.category] ?? 'bg-slate-100 text-slate-700'}`}>
              {CATEGORY_LABEL[article.category] ?? article.category}
            </span>
            <span className="text-xs text-slate-500">{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    </a>
  );
}

export function HeroSection({ articles }: Props) {
  if (articles.length === 0) return null;
  const [main, ...sides] = articles;
  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">新着記事</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-stretch">
        <HeroMainCard article={main} />
        <div className="flex flex-col gap-3">
          {sides.slice(0, 4).map((a) => (
            <HeroSideCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
