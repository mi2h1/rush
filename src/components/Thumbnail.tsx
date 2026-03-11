const SOURCE_ICON: Record<string, string> = {
  Zenn:  'https://cdn.simpleicons.org/zenn/3ea8ff',
  Qiita: 'https://cdn.simpleicons.org/qiita/55c500',
  note:  'https://cdn.simpleicons.org/note/41c9b4',
  X:     'https://cdn.simpleicons.org/x/e7e9ea',
};

const SOURCE_COLOR: Record<string, string> = {
  Zenn:  '#3ea8ff',
  Qiita: '#55c500',
  note:  '#41c9b4',
  X:     '#e7e9ea',
};

interface Props {
  url?: string;
  category: string;
  source?: string;
  size?: 'large' | 'small';
}

function Logo({ source, size }: { source: string; size: 'large' | 'small' }) {
  const icon = SOURCE_ICON[source];
  if (!icon) return null;
  return (
    <div className="thumb-logo">
      <img src={icon} alt={source} className="thumb-logo-icon" />
      {size === 'large' && (
        <span className="thumb-logo-text" style={{ color: SOURCE_COLOR[source] }}>
          {source}
        </span>
      )}
    </div>
  );
}

export function Thumbnail({ url, category, source, size = 'large' }: Props) {
  if (url) {
    return (
      <div className={`thumbnail thumbnail-${size}`}>
        <img
          src={url}
          alt=""
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget.parentElement;
            if (el) {
              el.classList.add('thumbnail-placeholder');
              el.classList.add(`cat-${category}`);
              e.currentTarget.replaceWith(
                Object.assign(document.createElement('div'), { className: 'thumb-logo-wrap' })
              );
            }
          }}
        />
      </div>
    );
  }
  return (
    <div className={`thumbnail thumbnail-${size} thumbnail-placeholder cat-${category}`}>
      {source && <Logo source={source} size={size} />}
    </div>
  );
}
