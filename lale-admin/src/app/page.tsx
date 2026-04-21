'use client';

import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib/api';

import { ProtectedShell } from '@/components/ProtectedShell';
import { PageHeader } from '@/components/PageHeader';
import { KpiCard } from '@/components/KpiCard';
import { UserManager } from '@/components/UserManager';

type User = {
  id: string;
  login: string;
  email: string;
  avatarUrl?: string | null;
  role: 'ADMIN' | 'CLIENT';
};

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    api
      .getUsers()
      .then((data) => {
        if (cancelled) return;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователей');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const adminCount = useMemo(
    () => users.filter((u) => u.role === 'ADMIN').length,
    [users],
  );

  const clientCount = useMemo(
    () => users.filter((u) => u.role === 'CLIENT').length,
    [users],
  );

  return (
    <ProtectedShell>
      <PageHeader
        title="Dashboard"
        description="Обзор пользователей и основных сущностей системы мониторинга озёр."
      />

      {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}

      <section className="grid cards-3" style={{ marginBottom: 24 }}>
        <KpiCard title="Всего пользователей" value={loading ? '—' : users.length} />
        <KpiCard title="Администраторы" value={loading ? '—' : adminCount} />
        <KpiCard title="Клиенты" value={loading ? '—' : clientCount} />
      </section>

      <section>
        <UserManager />
      </section>
    </ProtectedShell>
  );
}
