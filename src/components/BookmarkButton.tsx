import { useAuth } from '../context/AuthContext';

export function BookmarkButton({ articleId }: { articleId: string }) {
  const { isLoggedIn, bookmarkedIds, toggleBookmark } = useAuth();
  if (!isLoggedIn) return null;

  const isBookmarked = bookmarkedIds.has(articleId);

  return (
    <button
      className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors ${
        isBookmarked
          ? 'text-primary-500 bg-primary-50 hover:bg-primary-100'
          : 'text-slate-400 hover:text-slate-600 hover:bg-gray-100'
      }`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(articleId); }}
      title={isBookmarked ? 'ブックマーク解除' : 'ブックマーク'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
