import type { ReactNode } from 'react';

interface Props {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ header, sidebar, children }: Props) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 relative z-30">
        {header}
      </div>
      <div className="flex-shrink-0">{sidebar}</div>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
