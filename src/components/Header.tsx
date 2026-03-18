interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  lastUpdated?: string;
}

export function Header({ darkMode, onToggleDark, lastUpdated }: Props) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-slate-900">Rush</span>
        <span className="text-sm text-slate-400 hidden sm:block">日本語AI情報</span>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="text-sm text-slate-500 hidden md:block">
            最終更新: {lastUpdated}
          </span>
        )}
        <button
          onClick={onToggleDark}
          aria-label={darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
          className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-slate-600"
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
