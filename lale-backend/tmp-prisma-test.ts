import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  try {
    const user = await client.user.findFirst();
    console.log("user", user);
  } catch (error) {
    console.error(error);
  } finally {
    await client.$disconnect();
  }
}

main();
