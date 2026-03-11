export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-text">Rush</span>
          <span className="logo-tagline">日本語AI情報アグリゲーター</span>
        </div>
        <div className="header-sources">
          <span className="source-badge zenn">Zenn</span>
          <span className="source-badge note">note</span>
          <span className="source-badge qiita">Qiita</span>
        </div>
      </div>
    </header>
  );
}
