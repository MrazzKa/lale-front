'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProtectedShell } from '@/components/ProtectedShell';
import { PageHeader } from '@/components/PageHeader';
import { KpiCard } from '@/components/KpiCard';
import { GlobalStatsChart } from '@/components/GlobalStatsChart';

type Stats = {
  summary: {
    users: number;
    waterBodies: number;
    measurements: number;
  };
  monthlyStats: { name: string; count: number }[];
  districtStats: { name: string; count: number }[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    api
      .getGlobalStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Ошибка загрузки статистики');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProtectedShell>
      <PageHeader
        title="Панель управления"
        description="Глобальный обзор системы: пользователи, водоёмы и активность мониторинга."
      />

      {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}

      <section className="grid cards-3" style={{ marginBottom: 24 }}>
        <KpiCard 
          title="Пользователи" 
          value={loading ? '—' : stats?.summary.users ?? 0} 
          hint="Всего зарегистрированных аккаунтов"
        />
        <KpiCard 
          title="Водоёмы" 
          value={loading ? '—' : stats?.summary.waterBodies ?? 0} 
          hint="Объекты в системе мониторинга"
        />
        <KpiCard 
          title="Замеры" 
          value={loading ? '—' : stats?.summary.measurements ?? 0} 
          hint="Всего внесенных записей"
        />
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        <GlobalStatsChart 
          title="Активность мониторинга (кол-во замеров)" 
          data={stats?.monthlyStats ?? []} 
          color="#3b82f6" 
        />
        <GlobalStatsChart 
          title="Распределение по районам" 
          data={stats?.districtStats ?? []} 
          color="#10b981" 
        />
      </section>

      <div className="card stack">
        <h3 className="section-title">Быстрые действия</h3>
        <div className="details-grid">
          <p className="muted">Используйте боковое меню для управления пользователями или перейдите в раздел водоёмов для добавления новых данных.</p>
        </div>
      </div>
    </ProtectedShell>
  );
}
