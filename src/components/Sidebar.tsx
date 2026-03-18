import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { PageId } from '../types';

interface Props {
  active: PageId;
  onNavigate: (page: PageId) => void;
}

function NavItem({
  id, active, label, icon, onClick,
}: {
  id: PageId;
  active: PageId;
  label: string;
  icon: ReactNode;
  onClick: (id: PageId) => void;
}) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
        isActive
          ? 'text-primary-500 bg-primary-50'
          : 'text-body hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function Sidebar({ active, onNavigate }: Props) {
  const { isLoggedIn } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="メインナビゲーション">
        <NavItem id="top" active={active} onClick={onNavigate} label="トップ" icon={
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        } />
        <NavItem id="articles" active={active} onClick={onNavigate} label="記事一覧" icon={
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        } />

        {isLoggedIn && (
          <>
            <div className="border-t border-slate-200 my-2 mx-1" role="separator" />
            <NavItem id="bookmarks" active={active} onClick={onNavigate} label="ブックマーク" icon={
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            } />
          </>
        )}
      </nav>

      {isLoggedIn && (
        <div className="mt-auto border-t border-slate-200 px-3 py-4">
          <NavItem id="admin" active={active} onClick={onNavigate} label="管理" icon={
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          } />
        </div>
      )}
    </aside>
  );
}
