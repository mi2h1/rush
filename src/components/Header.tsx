import { useAuth } from '../context/AuthContext';
import type { PageId } from '../types';

interface Props {
  onNavigate: (page: PageId) => void;
}

export function Header({ onNavigate }: Props) {
  const { isLoggedIn } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-text">Rush</span>
          <span className="logo-tagline">日本語AI情報アグリゲーター</span>
        </div>
        <div className="header-sources">
          <span className="source-badge zenn">Zenn</span>
          <span className="source-badge qiita">Qiita</span>
        </div>
        {isLoggedIn && (
          <button className="header-bookmarks-btn" onClick={() => onNavigate('bookmarks')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            ブックマーク
          </button>
        )}
      </div>
    </header>
  );
}
