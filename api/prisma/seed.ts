import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { catalog } from '../src/catalog/catalog';

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@alanyerler.local')
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? 'Admin1234';
  const name = (process.env.ADMIN_NAME ?? 'Yönetici').trim();

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD en az 8 karakter olmalı.');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: Role.admin,
      active: true,
    },
  });
}

async function seedCatalog() {
  for (const category of catalog) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { slug: category.slug, name: category.name },
    });

    for (const deviceType of category.deviceTypes) {
      await prisma.deviceType.upsert({
        where: { slug: deviceType.slug },
        update: { name: deviceType.name, categoryId: saved.id },
        create: {
          slug: deviceType.slug,
          name: deviceType.name,
          categoryId: saved.id,
        },
      });
    }
  }
}

async function main() {
  await seedAdmin();
  await seedCatalog();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
