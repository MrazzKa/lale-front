import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promote(login: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      console.error(`User with login "${login}" not found.`);
      return;
    }

    await prisma.user.update({
      where: { login },
      data: { role: 'ADMIN' },
    });

    console.log(`Successfully promoted user "${login}" to ADMIN!`);
  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const loginToPromote = process.argv[2];

if (!loginToPromote) {
  console.log('Usage: npx ts-node promote-admin.ts <login>');
  process.exit(1);
}

promote(loginToPromote);
