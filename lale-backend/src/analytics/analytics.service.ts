import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [userCount, waterBodyCount, measurementCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.waterBody.count(),
      this.prisma.bioindicationRecord.count(),
    ]);

    // Measurements per month (last 12 months)
    const measurementsPerMonth = await this.prisma.bioindicationRecord.findMany({
      select: {
        recordDate: true,
      },
    });

    const monthlyStats = this.processMonthlyStats(measurementsPerMonth);

    // Distribution by district
    const districts = await this.prisma.waterBody.groupBy({
      by: ['district'],
      _count: {
        id: true,
      },
    });

    return {
      summary: {
        users: userCount,
        waterBodies: waterBodyCount,
        measurements: measurementCount,
      },
      monthlyStats,
      districtStats: districts.map((d) => ({
        name: d.district || 'Unknown',
        count: d._count.id,
      })),
    };
  }

  private processMonthlyStats(records: { recordDate: Date }[]) {
    const stats: Record<string, number> = {};
    
    // Initialize last 6 months with 0
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('ru-RU', { month: 'short', year: 'numeric' });
      stats[label] = 0;
    }

    records.forEach((r) => {
      const label = r.recordDate.toLocaleString('ru-RU', { month: 'short', year: 'numeric' });
      if (stats[label] !== undefined) {
        stats[label]++;
      }
    });

    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }
}
