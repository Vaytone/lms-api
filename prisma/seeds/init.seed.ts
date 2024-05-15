import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function initSeed() {
  const plan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Base Plan',
      max_admin: 20,
      max_student: 40,
      price: 9.99,
      max_watcher: 40,
    },
  });

  const organisation = await prisma.organisation.create({
    data: {
      name: 'Харківський ліцей №99',
      active: true,
      plan_id: plan.id,
      description: 'Kharkiv cool',
      greeting_text: 'Trest',
      short_name: 'ХЛ №99',
      registration_active: true,
    },
  });

  await prisma.registerLink.create({
    data: {
      organisation_id: organisation.id,
      role: 'admin',
      link_code: '123',
    },
  });
}

initSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
