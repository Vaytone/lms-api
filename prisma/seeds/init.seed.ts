import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const students = [
  {
    full_name: 'Олег Шевченко',
    email: 'oleg_shevchenko@ukr.net',
    first_name: 'Олег',
    last_name: 'Шевченко',
    avatar: null,
  },
  {
    full_name: 'Катерина Мельник',
    email: 'kateryna_melnyk@gmail.com',
    first_name: 'Катерина',
    last_name: 'Мельник',
    avatar: null,
  },
  {
    full_name: 'Тарас Коваленко',
    email: 'taras_kovalenko@ukr.net',
    first_name: 'Тарас',
    last_name: 'Коваленко',
    avatar: null,
  },
  {
    full_name: 'Ірина Бойко',
    email: 'iryna_boyko@gmail.com',
    first_name: 'Ірина',
    last_name: 'Бойко',
    avatar: null,
  },
  {
    full_name: 'Віктор Поліщук',
    email: 'viktor_polishchuk@ukr.net',
    first_name: 'Віктор',
    last_name: 'Поліщук',
    avatar: null,
  },
  {
    full_name: 'Наталія Іваненко',
    email: 'natalia_ivanenko@gmail.com',
    first_name: 'Наталія',
    last_name: 'Іваненко',
    avatar: null,
  },
  {
    full_name: 'Андрій Ткаченко',
    email: 'andriy_tkachenko@ukr.net',
    first_name: 'Андрій',
    last_name: 'Ткаченко',
    avatar: null,
  },
  {
    full_name: 'Світлана Кравчук',
    email: 'svitlana_kravchuk@gmail.com',
    first_name: 'Світлана',
    last_name: 'Кравчук',
    avatar: null,
  },
  {
    full_name: 'Роман Литвиненко',
    email: 'roman_lytvynenko@ukr.net',
    first_name: 'Роман',
    last_name: 'Литвиненко',
    avatar: null,
  },
  {
    full_name: 'Олена Гриценко',
    email: 'olena_grytsenko@gmail.com',
    first_name: 'Олена',
    last_name: 'Гриценко',
    avatar: null,
  },
];

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

  await prisma.user.create({
    data: {
      full_name: 'Oleg Volobuev',
      organisation_id: organisation.id,
      avatar: null,
      email: 'oleg_top2001@gmail.com',
      first_name: 'Oleg',
      last_name: 'Volobuev',
      password: '123123123',
      user_info: {
        create: {
          role: 'student',
          organisation_id: organisation.id,
          role_description: 'Student',
        },
      },
      user_statuses: {
        create: {
          status: 'active',
          closed: false,
        },
      },
    },
  });

  await Promise.all(
    students.map(async (student) => {
      return prisma.user.create({
        data: {
          full_name: student.full_name,
          organisation_id: organisation.id,
          avatar: null,
          email: student.email,
          first_name: student.first_name,
          last_name: student.last_name,
          password: '123123123',
          user_info: {
            create: {
              role: 'student',
              organisation_id: organisation.id,
              role_description: 'Student',
            },
          },
          user_statuses: {
            create: {
              status: 'active',
              closed: false,
            },
          },
        },
      });
    }),
  );

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
