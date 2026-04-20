'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/water-bodies', label: 'Water bodies' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Lakes Admin</h2>
        <p>Панель управления системой водных ресурсов.</p>
      </div>
      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <button
          className="btn secondary"
          style={{ width: '100%' }}
          onClick={() => {
            authStorage.clear();
            router.push('/login');
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
