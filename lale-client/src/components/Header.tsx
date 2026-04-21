'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-block" onClick={closeMenu}>
          <span className="brand-badge">LW</span>
          <div className="brand-copy">
            <div className="brand-title">WaterMonitor</div>
            <div className="brand-subtitle">Система мониторинга водоемов</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'is-active' : ''}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-user">
          {user && (
            <button
              className="btn secondary"
              onClick={() => {
                authStorage.clear();
                router.replace('/login');
              }}
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}