'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth';
import { Sidebar } from './Sidebar';

export function ProtectedShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="centered">Проверка авторизации...</div>;
  }

  return (
    <div className="layout">
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Открыть меню"
        onClick={() => setMenuOpen(true)}
      >
        <span />
      </button>

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div
        className={`sidebar-backdrop${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      <main className="content">{children}</main>
    </div>
  );
}
