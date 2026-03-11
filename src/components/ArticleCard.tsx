import { type Article } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';

interface Props {
  article: Article;
  featured?: boolean;
}

const SOURCE_LABEL: Record<string, string> = {
  Zenn: 'Zenn',
  note: 'note',
  Qiita: 'Qiita',
};

const CATEGORY_LABEL: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  meta: 'Meta',
  other: 'その他',
};

export function ArticleCard({ article, featured = false }: Props) {
  const { title, source, category, publishedAt, summary, tags, url, thumbnailUrl } = article;

  return (
    <article
      className={`article-card ${featured ? 'featured' : ''}`}
      data-category={category}
    >
      <div className="article-card-inner">
        <Thumbnail url={thumbnailUrl} category={category} source={source} size="small" />
        <div className="article-card-body">
          <div className="card-header">
            <span className={`source-badge ${source.toLowerCase()}`}>
              {SOURCE_LABEL[source]}
            </span>
            <span className={`category-badge cat-${category}`}>
              {CATEGORY_LABEL[category]}
            </span>
          </div>
          <a href={url} className="card-title" target="_blank" rel="noopener noreferrer">
            {title}
          </a>
          <p className="card-summary">{summary}</p>
          <div className="card-footer">
            <div className="card-tags">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="card-tag">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="card-time">{formatRelativeTime(publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
