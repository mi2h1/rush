import { useAuth } from '../context/AuthContext';

export function BookmarkButton({ articleId }: { articleId: string }) {
  const { isLoggedIn, bookmarkedIds, toggleBookmark } = useAuth();
  if (!isLoggedIn) return null;

  const isBookmarked = bookmarkedIds.has(articleId);

  return (
    <button
      className={`bookmark-btn ${isBookmarked ? 'bookmark-btn-on' : ''}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(articleId); }}
      title={isBookmarked ? 'ブックマーク解除' : 'ブックマーク'}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
