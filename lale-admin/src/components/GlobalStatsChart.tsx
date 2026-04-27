'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

type Props = {
  data: { name: string; count: number }[];
  title: string;
  color?: string;
};

export function GlobalStatsChart({ data, title, color = '#1f6feb' }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="card stack centered" style={{ minHeight: 200 }}>
        <p className="muted">Нет данных для статистики</p>
      </div>
    );
  }

  return (
    <div className="card stack" style={{ height: '100%' }}>
      <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: 16 }}>{title}</h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]} 
              barSize={40}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8 + (index / data.length) * 0.2} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
