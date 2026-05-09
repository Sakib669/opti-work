import bcrypt from 'bcryptjs';
import { PrismaClient, TaskPriority, TaskStatus, WorkstationStatus, WorkstationType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@optiwork.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@optiwork.com',
      password: passwordHash,
      role: UserRole.ADMIN
    }
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@optiwork.com' },
    update: {},
    create: {
      name: 'Staff User',
      email: 'staff@optiwork.com',
      password: passwordHash,
      role: UserRole.STAFF
    }
  });

  const assemblyStation = await prisma.workstation.upsert({
    where: { name: 'Assembly Station A1' },
    update: {},
    create: {
      name: 'Assembly Station A1',
      type: WorkstationType.ASSEMBLY,
      status: WorkstationStatus.ACTIVE
    }
  });

  const testingStation = await prisma.workstation.upsert({
    where: { name: 'Testing Lab T2' },
    update: {},
    create: {
      name: 'Testing Lab T2',
      type: WorkstationType.TESTING,
      status: WorkstationStatus.MAINTENANCE
    }
  });

  await prisma.task.upsert({
    where: { title: 'Inspect widget batch 12' },
    update: {},
    create: {
      title: 'Inspect widget batch 12',
      description: 'Confirm dimensions and quality for the current widget batch.',
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      workstationId: testingStation.id,
      assigneeId: staff.id,
      createdById: admin.id
    }
  });

  await prisma.task.upsert({
    where: { title: 'Assemble device housing' },
    update: {},
    create: {
      title: 'Assemble device housing',
      description: 'Build housings from injection-molded parts and hand-off to testing.',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      workstationId: assemblyStation.id,
      assigneeId: staff.id,
      createdById: admin.id
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
