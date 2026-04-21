'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/water-bodies', label: 'Water bodies' },
];

export function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className={`sidebar${isOpen ? ' is-open' : ''}`}>
      <div className="sidebar-header">
        <div className="eyebrow">Control panel</div>
        <h2>Lakes Admin</h2>
        <p>Управление озёрами, пользователями и замерами</p>
      </div>

      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? 'active' : ''}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="btn secondary"
          style={{ width: '100%' }}
          onClick={() => {
            authStorage.clear();
            router.push('/login');
          }}
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
