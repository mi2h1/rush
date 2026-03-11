import { CATEGORIES, type CategoryId } from '../types';

interface Props {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <nav className="category-tabs">
      <div className="category-tabs-inner">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${active === cat.id ? 'active' : ''} cat-${cat.id}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
