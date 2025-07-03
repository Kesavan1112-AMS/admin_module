import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('Fetching users from the database...');
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        userCategory: true,
      },
    });
    console.log('--- All Users in DB ---');
    console.dir(allUsers, { depth: null });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
