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
    update: { passwordHash: adminPassword, isActive: true, role: UserRole.SUPER_ADMIN },
    create: {
      email: "admin@attl.school",
      name: "ATTL Administrator",
      passwordHash: adminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  const memberOne = await prisma.user.upsert({
    where: { email: "member@attl.school" },
    update: { passwordHash: studentPassword, isActive: true, role: UserRole.ATTL_MEMBER, attlMembershipActive: true, attlActivatedAt: new Date() },
    create: {
      email: "member@attl.school",
      name: "ATTL Builder",
      passwordHash: studentPassword,
      role: UserRole.ATTL_MEMBER,
      attlMembershipActive: true,
      attlActivatedAt: new Date(),
      gradeLevel: "Secondary",
      className: "A2",
      xp: 650,
      level: 2,
      studentProfile: { create: {} },
    },
  });

  await prisma.user.upsert({
    where: { email: "lead@attl.school" },
    update: { passwordHash: studentPassword, isActive: true, role: UserRole.TRACK_LEAD, attlMembershipActive: true, attlActivatedAt: new Date() },
    create: {
      email: "lead@attl.school",
      name: "ATTL Track Lead",
      passwordHash: studentPassword,
      role: UserRole.TRACK_LEAD,
      attlMembershipActive: true,
      attlActivatedAt: new Date(),
      gradeLevel: "Secondary",
      className: "B1",
      xp: 1200,
      level: 3,
      studentProfile: { create: {} },
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@attl.school" },
    update: { passwordHash: studentPassword, isActive: true },
    create: {
      email: "teacher@attl.school",
      name: "ATTL Teacher",
      passwordHash: studentPassword,
      role: UserRole.TEACHER,
      teacherProfile: { create: { title: "Teacher" } },
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
      teacherId: teacher.id,
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

  const course = await prisma.course.upsert({
    where: { id: "seed-course-web-fundamentals" },
    update: { published: true },
    create: {
      id: "seed-course-web-fundamentals",
      title: "Web Development Foundations",
      description: "Build a strong foundation in modern web development.",
      level: "Beginner",
      published: true,
      subjectId: subjectByCode.ENG.id,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "seed-lesson-html" },
    update: {},
    create: { id: "seed-lesson-html", courseId: course.id, title: "HTML Foundations", content: "Structure pages with semantic HTML.", position: 1, duration: 25 },
  });
  await prisma.lesson.upsert({
    where: { id: "seed-lesson-css" },
    update: {},
    create: { id: "seed-lesson-css", courseId: course.id, title: "Modern CSS", content: "Build responsive layouts and polished interfaces.", position: 2, duration: 35 },
  });
  await prisma.resource.upsert({
    where: { id: "seed-resource-mdn" },
    update: {},
    create: { id: "seed-resource-mdn", courseId: course.id, title: "MDN Web Docs", description: "Reference material for web development.", type: "Reference", url: "https://developer.mozilla.org/" },
  });

  const projectSeed = await prisma.project.upsert({
    where: { slug: "attl-smart-campus-demo" },
    update: { ownerId: memberOne.id, visibility: "school", progress: 62 },
    create: {
      ownerId: memberOne.id,
      title: "ATTL Smart Campus",
      slug: "attl-smart-campus-demo",
      description: "A school technology concept for connected campus services.",
      visibility: "school",
      status: "ACTIVE",
      progress: 62,
    },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: projectSeed.id, userId: memberOne.id } },
    update: { role: "Owner" },
    create: { projectId: projectSeed.id, userId: memberOne.id, role: "Owner" },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: projectSeed.id, userId: student.id } },
    update: { role: "Member" },
    create: { projectId: projectSeed.id, userId: student.id, role: "Member" },
  });
  await prisma.projectMilestone.upsert({
    where: { id: "seed-milestone-prototype" },
    update: { projectId: projectSeed.id, progress: 75, status: "In Progress" },
    create: { id: "seed-milestone-prototype", projectId: projectSeed.id, title: "Prototype", description: "Build the first working prototype.", progress: 75, status: "In Progress", dueAt: new Date("2026-10-12T12:00:00.000Z") },
  });

  const eventSeeds = [
    ["seed-event-innovation", "ATTL Innovation Workshop", "Learn how ATTL teams turn problems into prototypes.", new Date("2026-09-24T15:00:00.000Z"), new Date("2026-09-24T17:00:00.000Z"), "Innovation Lab"],
    ["seed-event-demo", "Project Demo Day", "Teams present what they have built.", new Date("2026-10-05T14:00:00.000Z"), new Date("2026-10-05T17:00:00.000Z"), "School Hall"],
    ["seed-event-hackathon", "Student Hackathon", "A collaborative build day for school teams.", new Date("2026-10-12T10:00:00.000Z"), new Date("2026-10-12T18:00:00.000Z"), "Computer Lab"],
  ] as const;
  for(const [id,title,description,startsAt,endsAt,location] of eventSeeds){
    await prisma.event.upsert({where:{id},update:{title,description,startsAt,endsAt,location},create:{id,title,description,startsAt,endsAt,location,capacity:80}});
  }

  const competitionSeeds = [
    ["seed-comp-isef","ISEF Science & Engineering","Student science and engineering project opportunity.","School Innovation Office",new Date("2026-10-18T12:00:00.000Z"),new Date("2026-10-10T21:00:00.000Z")],
    ["seed-comp-climate","Climate Innovation Challenge","Build a solution around a real climate problem.","ATTL",new Date("2026-11-02T12:00:00.000Z"),new Date("2026-10-26T21:00:00.000Z")],
    ["seed-comp-hack","School Hackathon","Build and demo a useful digital product.","ATTL",new Date("2026-11-14T12:00:00.000Z"),new Date("2026-11-10T21:00:00.000Z")],
  ] as const;
  for(const [id,title,description,organizer,startsAt,deadlineAt] of competitionSeeds){
    await prisma.competition.upsert({where:{id},update:{title,description,organizer,startsAt,deadlineAt},create:{id,title,description,organizer,startsAt,deadlineAt}});
  }

  await prisma.eventRegistration.upsert({
    where:{eventId_userId:{eventId:"seed-event-innovation",userId:student.id}},
    update:{},create:{eventId:"seed-event-innovation",userId:student.id}
  });

  await prisma.mentorshipRequest.upsert({
    where:{id:"seed-mentorship-request"},
    update:{status:"Accepted"},
    create:{id:"seed-mentorship-request",menteeId:student.id,mentorId:teacher.id,message:"Help me plan my first software project.",status:"Accepted"}
  });

  await prisma.goal.upsert({
    where:{id:"seed-goal-first-project"},
    update:{progress:70},
    create:{id:"seed-goal-first-project",userId:student.id,title:"Ship my first school project",description:"Create and publish a working project.",progress:70,targetDate:new Date("2026-10-20T21:00:00.000Z")}
  });

  await prisma.notification.createMany({
    data:[
      {userId:student.id,title:"Welcome to ATTL School OS",body:"Your School OS workspace is ready.",type:"SYSTEM"},
      {userId:student.id,title:"New ATTL workshop",body:"A new innovation workshop is available.",type:"ATTL"},
    ],
    skipDuplicates:true,
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
