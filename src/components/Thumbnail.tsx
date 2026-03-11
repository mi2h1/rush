interface Props {
  url?: string;
  category: string;
  size?: 'large' | 'small';
}

export function Thumbnail({ url, category, size = 'large' }: Props) {
  if (url) {
    return (
      <div className={`thumbnail thumbnail-${size}`}>
        <img
          src={url}
          alt=""
          loading="lazy"
          onError={(e) => {
            // 画像取得失敗時はプレースホルダーに切り替え
            const el = e.currentTarget.parentElement;
            if (el) {
              el.classList.add('thumbnail-placeholder');
              el.classList.add(`cat-${category}`);
              e.currentTarget.remove();
            }
          }}
        />
      </div>
    );
  }
  return <div className={`thumbnail thumbnail-${size} thumbnail-placeholder cat-${category}`} />;
}
