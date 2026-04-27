'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGlobalStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedShell>
      <div className="stack">
        <PageHeader
          title="Геопортал озёр"
          description="Интеллектуальная система мониторинга и биоиндикации водных объектов."
          action={
            <Link className="btn" href="/water-bodies">
              Открыть карту озёр
            </Link>
          }
        />

        <section className="grid cards-3">
          <KpiCard 
            title="Водоёмы под наблюдением" 
            value={loading ? '—' : stats?.summary.waterBodies ?? 0} 
            hint="Объекты в реестре" 
          />
          <KpiCard 
            title="Проведено замеров" 
            value={loading ? '—' : stats?.summary.measurements ?? 0} 
            hint="Всего в базе" 
          />
          <KpiCard 
            title="Активных пользователей" 
            value={loading ? '—' : stats?.summary.users ?? 0} 
            hint="Сообщество мониторинга" 
          />
        </section>

        <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, margin: '24px 0' }}>
           <GlobalStatsChart 
            title="Динамика исследований" 
            data={stats?.monthlyStats ?? []} 
            color="#3b82f6" 
          />
          <section className="card stack">
            <h2 className="section-title">Возможности системы</h2>
            <div className="details-grid">
              <div><strong>Мониторинг:</strong> Доступ к актуальным химическим и биологическим показателям воды.</div>
              <div><strong>Аналитика:</strong> Наглядные графики изменений состояния водоёмов за разные годы.</div>
              <div><strong>Картография:</strong> Удобная карта для выбора интересующего объекта.</div>
              <div><strong>Паспортизация:</strong> Просмотр полных технических и экологических паспортов озёр.</div>
            </div>
          </section>
        </section>

        <section className="card stack alt-bg" style={{ background: 'var(--card-bg-alt, #f8fafc)', border: '1px solid #e2e8f0' }}>
          <h2 className="section-title">География мониторинга</h2>
          <p className="muted">Распределение исследуемых водоёмов по административным районам.</p>
          <div style={{ marginTop: 16 }}>
            <GlobalStatsChart 
              title="" 
              data={stats?.districtStats ?? []} 
              color="#10b981" 
            />
          </div>
        </section>
      </div>
    </ProtectedShell>
  );
}
