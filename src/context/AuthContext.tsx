import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, fetchBookmarkedIds, addBookmark, removeBookmark } from '../lib/supabase';

interface AuthContextType {
  isLoggedIn: boolean;
  bookmarkedIds: Set<string>;
  toggleBookmark: (articleId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  bookmarkedIds: new Set(),
  toggleBookmark: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const loadBookmarks = async () => {
    const ids = await fetchBookmarkedIds();
    setBookmarkedIds(new Set(ids));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
      if (data.session) loadBookmarks();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
      if (session) loadBookmarks();
      else setBookmarkedIds(new Set());
    });
    return () => subscription.unsubscribe();
  }, []);

  const toggleBookmark = async (articleId: string) => {
    if (bookmarkedIds.has(articleId)) {
      await removeBookmark(articleId);
      setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(articleId); return s; });
    } else {
      await addBookmark(articleId);
      setBookmarkedIds((prev) => new Set(prev).add(articleId));
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, bookmarkedIds, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
}
