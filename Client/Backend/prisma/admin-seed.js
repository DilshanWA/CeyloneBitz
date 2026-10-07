import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@ceylonbitz.com";
  const password = "Admin@12345";

  const passwordHash = await argon2.hash(password);

  const admin = await prisma.admin.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
      isActive: true,
    },
    create: {
      name: "Administrator",
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin created successfully");
  console.log("Email:", admin.email);
}

main()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });