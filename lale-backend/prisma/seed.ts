import { PrismaClient, Role } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  const admin = await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      email: 'admin@lale.geoportal',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const client = await prisma.user.upsert({
    where: { login: 'client' },
    update: {},
    create: {
      login: 'client',
      email: 'client@lale.geoportal',
      password: clientPassword,
      role: Role.CLIENT,
    },
  });

  console.log(`Users created: ${admin.login}, ${client.login}`);

  // 2. Create Water Bodies
  const lakes = [
    {
      name: 'Озеро Нарочь',
      district: 'Мядельский район',
      latitude: 54.85,
      longitude: 26.75,
      locationDesc: 'Самое большое озеро Беларуси',
      cadastralNumber: '1234-5678-9012',
    },
    {
      name: 'Озеро Мястро',
      district: 'Мядельский район',
      latitude: 54.88,
      longitude: 26.9,
      locationDesc: 'Расположено рядом с г. Мядель',
      cadastralNumber: '2234-5678-9012',
    },
    {
      name: 'Озеро Свирь',
      district: 'Мядельский район',
      latitude: 54.8,
      longitude: 26.4,
      locationDesc: 'Вытянутое озеро на западе области',
      cadastralNumber: '3234-5678-9012',
    },
  ];

  for (const lakeData of lakes) {
    const lake = await prisma.waterBody.create({
      data: {
        ...lakeData,
        passport: {
          create: {
            area: Math.random() * 80,
            maxDepth: Math.random() * 25,
            avgDepth: Math.random() * 10,
            volume: Math.random() * 700,
            fisheryType: 'Лещево-щучий',
            ichthyofauna: 'Окунь, щука, лещ, плотва',
            economicDesc: 'Рекреационное использование, рыболовство',
          },
        },
      },
    });

    console.log(`Created lake: ${lake.name}`);

    // 3. Create Measurements (BioindicationRecords)
    const years = [2023, 2024, 2025];
    const months = [4, 6, 8, 10]; // Spring, Summer, Autumn

    for (const year of years) {
      for (const month of months) {
        await prisma.bioindicationRecord.create({
          data: {
            waterBodyId: lake.id,
            recordDate: new Date(year, month - 1, 15),
            ph: 7 + (Math.random() * 2 - 1), // 6.0 to 8.0
            turbidity: Math.random() * 10,
            mineralization: 150 + Math.random() * 100,
            salinity: 0.1 + Math.random() * 0.2,
            hardness: 2 + Math.random() * 4,
            overgrowthPercent: Math.random() * 30,
            trophicStatus: month > 7 ? 'Эвтрофный' : 'Мезотрофный',
          },
        });
      }
    }
    console.log(`Added measurements for ${lake.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
