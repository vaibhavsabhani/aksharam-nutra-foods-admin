import "dotenv/config";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required seed environment variable: ${name}`);
  return value;
}

async function seedAdmin() {
  const email = requiredEnv("ADMIN_EMAIL").toLowerCase();
  const password = requiredEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Aksharam Admin";

  if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters long");

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: UserRole.ADMIN, status: UserStatus.ACTIVE },
    create: { name, email, passwordHash, role: UserRole.ADMIN, status: UserStatus.ACTIVE, isEmailVerified: true, emailVerifiedAt: new Date() },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log(`Admin seed complete: ${admin.email} (id: ${admin.id})`);
}

async function seedAll() {
  await seedAdmin();
}

seedAll()
  .catch((error) => {
    console.error("Database seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });