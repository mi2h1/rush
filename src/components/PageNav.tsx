import type { PageId } from '../types';

interface Props {
  active: PageId;
  onChange: (page: PageId) => void;
}

const PAGES: { id: PageId; label: string }[] = [
  { id: 'top', label: 'TOP' },
  { id: 'articles', label: '記事一覧' },
];

export function PageNav({ active, onChange }: Props) {
  return (
    <nav className="category-tabs">
      <div className="category-tabs-inner">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`category-tab ${active === p.id ? 'active cat-all' : ''}`}
            onClick={() => onChange(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
