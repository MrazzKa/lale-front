'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authStorage } from '@/lib/auth';
import { User } from '@/types';
import { UserAvatar } from './UserAvatar';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/water-bodies', label: 'Озёра' },
  { href: '/profile', label: 'Личный кабинет' },
];

export function Header({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    authStorage.clear();
    router.replace('/login');
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-block">
          <span className="brand-badge">LW</span>
          <div className="brand-copy">
            <div className="brand-title">WaterMonitor</div>
            <div className="brand-subtitle">Мониторинг озёр</div>
          </div>
        </Link>

        <nav className={`header-nav${isOpen ? ' is-open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'is-active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-user">
          {user ? (
            <div className="header-user-summary">
              <UserAvatar name={user.login || user.email} avatarUrl={user.avatarUrl} size={36} />
              <div className="header-user-text">
                <span className="header-user-name">{user.login || 'Пользователь'}</span>
                <span className="header-user-role">{user.role}</span>
              </div>
            </div>
          ) : null}

          {user ? (
            <button className="btn secondary" onClick={handleLogout}>
              Выйти
            </button>
          ) : null}

          <button
            type="button"
            className="header-toggle"
            aria-label="Меню"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
