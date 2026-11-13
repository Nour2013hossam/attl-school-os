import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (process.env.CONFIRM_DELETE_ALL_USERS !== "DELETE_ALL_USERS") {
    throw new Error(
      "Refusing to delete users. Set CONFIRM_DELETE_ALL_USERS=DELETE_ALL_USERS only after taking and verifying a database backup."
    );
  }

  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }
  if (password.length < 14) {
    throw new Error("ADMIN_PASSWORD must be at least 14 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    // User-owned records with ON DELETE CASCADE are also removed by the database.
    const deleted = await tx.user.deleteMany({});
    const admin = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        attlMembershipActive: true,
        attlActivatedAt: new Date(),
      },
      select: { id: true, name: true, email: true, role: true },
    });

    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "BOOTSTRAP_SUPER_ADMIN_AND_CLEAR_USERS",
        entity: "User",
        entityId: admin.id,
        metadata: { deletedUserCount: deleted.count },
      },
    });

    return { deletedUserCount: deleted.count, admin };
  });

  console.log("Super Admin created successfully.");
  console.log(JSON.stringify(result, null, 2));
  console.log("No password was printed or stored in the repository.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
