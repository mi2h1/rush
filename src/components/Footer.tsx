export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">Rush</span>
        <span className="footer-desc">日本語AI情報アグリゲーター — Zenn / Qiita / X</span>
        <span className="footer-copy">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
