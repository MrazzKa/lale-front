import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function promote(identifier: string) {
  try {
    const user = identifier.includes('@')
      ? await prisma.user.findUnique({ where: { email: identifier } })
      : await prisma.user.findUnique({ where: { login: identifier } });

    if (!user) {
      console.error(`User "${identifier}" not found.`);
      process.exitCode = 1;
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });

    console.log(`Successfully promoted "${identifier}" to ADMIN.`);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

const identifier = process.argv[2];

if (!identifier) {
  console.log('Usage: npx ts-node promote-admin.ts <login-or-email>');
  process.exit(1);
}

promote(identifier);
