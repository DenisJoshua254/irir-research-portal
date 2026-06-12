// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const lecturer = await prisma.user.upsert({
    where: { email: "lecturer@irir.ac.ke" },
    update: {},
    create: {
      name: "Dr. Jane Mwangi",
      email: "lecturer@irir.ac.ke",
      password: hashedPassword,
      role: Role.LECTURER,
    },
  });

  const collaborator = await prisma.user.upsert({
    where: { email: "collaborator@irir.ac.ke" },
    update: {},
    create: {
      name: "John Kamau",
      email: "collaborator@irir.ac.ke",
      password: hashedPassword,
      role: Role.COLLABORATOR,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1",
      title: "Climate Change Impact on Agriculture in East Africa",
      description:
        "A comprehensive study on the effects of climate change on agricultural productivity across East African nations, focusing on smallholder farmers and sustainable adaptation strategies.",
      status: "ACTIVE",
      ownerId: lecturer.id,
    },
  });

  await prisma.collaboration.upsert({
    where: {
      userId_projectId: {
        userId: collaborator.id,
        projectId: project.id,
      },
    },
    update: {},
    create: {
      userId: collaborator.id,
      projectId: project.id,
    },
  });

  await prisma.comment.create({
    data: {
      message:
        "Great project! I have some data from the Rift Valley region that could be useful.",
      userId: collaborator.id,
      projectId: project.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log("Lecturer login: lecturer@irir.ac.ke / password123");
  console.log("Collaborator login: collaborator@irir.ac.ke / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
