import { type Article } from '../types';
import { Thumbnail } from './Thumbnail';
import { formatRelativeTime } from '../lib/time';

const CATEGORY_LABEL: Record<string, string> = {
  openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google',
  meta: 'Meta', other: 'その他',
};

interface Props {
  articles: Article[];
}

function HeroMainCard({ article }: { article: Article }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hero-main-card">
      <Thumbnail url={article.thumbnailUrl} category={article.category} size="large" />
      <div className="hero-main-body">
        <div className="card-header">
          <span className={`source-badge ${article.source.toLowerCase()}`}>{article.source}</span>
          <span className={`category-badge cat-${article.category}`}>{CATEGORY_LABEL[article.category]}</span>
        </div>
        <h2 className="hero-main-title">{article.title}</h2>
        <p className="hero-main-summary">{article.summary}</p>
        <span className="card-time">{formatRelativeTime(article.publishedAt)}</span>
      </div>
    </a>
  );
}

function HeroSideCard({ article }: { article: Article }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hero-side-card">
      <Thumbnail url={article.thumbnailUrl} category={article.category} size="small" />
      <div className="hero-side-body">
        <span className={`category-badge cat-${article.category}`}>{CATEGORY_LABEL[article.category]}</span>
        <p className="hero-side-title">{article.title}</p>
        <span className="card-time">{formatRelativeTime(article.publishedAt)}</span>
      </div>
    </a>
  );
}

export function HeroSection({ articles }: Props) {
  if (articles.length === 0) return null;
  const [main, ...sides] = articles;
  return (
    <section className="section">
      <h2 className="section-title">新着記事</h2>
      <div className="hero-grid">
        <HeroMainCard article={main} />
        <div className="hero-side-list">
          {sides.slice(0, 4).map((a) => (
            <HeroSideCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
