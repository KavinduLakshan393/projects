import "dotenv/config";
import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Success:", user);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
