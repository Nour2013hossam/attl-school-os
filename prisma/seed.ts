import { PrismaClient, UserRole } from "@prisma/client";
import { PERMISSION_CATALOG } from "../lib/roles";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const seedPassword = process.env.SEED_PASSWORD ?? "ChangeMe123!";

  for (const [key, name, category] of PERMISSION_CATALOG) {
    await prisma.permission.upsert({
      where: { key },
      update: { name, category },
      create: { key, name, category },
    });
  }

  const studentPassword = await bcrypt.hash(seedPassword, 12);

  const student = await prisma.user.upsert({
    where: { email: "student@attl.school" },
    update: {},
    create: {
      email: "student@attl.school",
      name: "ATTL Student",
      passwordHash: studentPassword,
      role: UserRole.STUDENT,
      gradeLevel: "Secondary",
      className: "A1",
      xp: 0,
      level: 1,
      studentProfile: { create: {} },
    },
  });

  const adminPassword = await bcrypt.hash(seedPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@attl.school" },
    update: {},
    create: {
      email: "admin@attl.school",
      name: "ATTL Administrator",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const subjects = [
    { code: "MATH", name: "Mathematics", type: "Core", credits: 3 },
    { code: "PHY", name: "Physics", type: "Core", credits: 3 },
    { code: "CHEM", name: "Chemistry", type: "Core", credits: 3 },
    { code: "ENG", name: "English", type: "Language", credits: 2 },
  ];

  const subjectRows = [];
  for (const item of subjects) {
    const subject = await prisma.subject.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    });

    subjectRows.push(subject);

    await prisma.enrollment.upsert({
      where: {
        userId_subjectId_term: {
          userId: student.id,
          subjectId: subject.id,
          term: "2026-2027",
        },
      },
      update: {},
      create: {
        userId: student.id,
        subjectId: subject.id,
        term: "2026-2027",
      },
    });
  }

  const tracks = [
    ["Software Engineering", "Build web, mobile and software systems."],
    ["AI & Data", "Explore machine learning, data and intelligent systems."],
    ["Hardware & Robotics", "Prototype physical systems, electronics and robotics."],
    ["Design & Media", "Design interfaces, media experiences and creative products."],
  ];

  for (const [name, description] of tracks) {
    await prisma.attlTrack.upsert({
      where: { name },
      update: { description, active: true },
      create: { name, description, active: true },
    });
  }

  const questions = [
    "Why do you want to join ATTL?",
    "What project or problem would you like to work on?",
    "Which skills would you like to develop?",
  ];

  for (let i = 0; i < questions.length; i += 1) {
    const existing = await prisma.applicationQuestion.findFirst({
      where: { prompt: questions[i] },
    });

    if (!existing) {
      await prisma.applicationQuestion.create({
        data: {
          prompt: questions[i],
          type: "text",
          required: true,
          position: i,
          active: true,
        },
      });
    }
  }

  const subjectByCode = Object.fromEntries(
    subjectRows.map((subject) => [subject.code, subject])
  );

  const timetable = [
    ["MATH", 1, 480, 540, "Room A12", "Class"],
    ["PHY", 1, 555, 615, "Room B04", "Class"],
    ["ENG", 1, 630, 690, "Room C08", "Class"],
    ["CHEM", 2, 480, 540, "Lab 01", "Lab"],
    ["MATH", 2, 555, 615, "Room A12", "Class"],
    ["PHY", 2, 630, 690, "Room B04", "Class"],
    ["ENG", 3, 480, 540, "Room C08", "Class"],
    ["CHEM", 3, 555, 615, "Lab 01", "Lab"],
    ["MATH", 3, 630, 690, "Room A12", "Class"],
    ["PHY", 4, 480, 540, "Room B04", "Class"],
    ["CHEM", 4, 555, 615, "Lab 01", "Lab"],
    ["ENG", 4, 630, 690, "Room C08", "Class"],
    ["MATH", 5, 510, 570, "Room A12", "Class"],
  ] as const;

  await prisma.scheduleItem.deleteMany({});
  await prisma.scheduleItem.createMany({
    data: timetable.map(([code, dayOfWeek, startMinute, endMinute, room, kind]) => ({
      subjectId: subjectByCode[code].id,
      dayOfWeek,
      startMinute,
      endMinute,
      room,
      kind,
      active: true,
    })),
  });

  const achievements = [
    ["First Step", "Complete your School OS profile.", "✦", 50],
    ["Builder", "Create your first project.", "◆", 100],
    ["Explorer", "Join your first competition.", "★", 100],
  ] as const;

  for (const [title, description, icon, xpReward] of achievements) {
    await prisma.achievement.upsert({
      where: { title },
      update: { description, icon, xpReward },
      create: { title, description, icon, xpReward },
    });
  }

  await prisma.appSetting.upsert({
    where: { key: "results.defaultTerm" },
    update: { value: "2026-2027" },
    create: { key: "results.defaultTerm", value: "2026-2027" },
  });

  await prisma.resultRelease.upsert({
    where: { term: "2026-2027" },
    update: {},
    create: {
      term: "2026-2027",
      releaseAt: new Date("2027-01-15T09:00:00.000Z"),
      locked: true,
    },
  });

  await prisma.course.upsert({
    where: { id: "seed-course-web-fundamentals" },
    update: {},
    create: {
      id: "seed-course-web-fundamentals",
      title: "Web Development Foundations",
      description: "Build a strong foundation in modern web development.",
      level: "Beginner",
      published: true,
      subjectId: subjectByCode.ENG.id,
    },
  });

  console.log("ATTL School OS seed complete.");
  console.log("Dev student:", "student@attl.school");
  console.log("Dev admin:", "admin@attl.school");
  console.log("Dev password is controlled by SEED_PASSWORD.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
