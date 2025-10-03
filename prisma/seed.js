import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SuperAdmin' },
    update: {},
    create: { name: 'SuperAdmin' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager' },
  });

  // Create permissions
  // Since 'name' is not unique, and 'action' and 'resource' are not unique together,
  // we will use findFirst and create if not found instead of upsert
  let manageUsersPerm = await prisma.permission.findFirst({
    where: { action: 'manage', resource: 'users' },
  });
  if (!manageUsersPerm) {
    manageUsersPerm = await prisma.permission.create({
      data: { action: 'manage', resource: 'users', roleId: superAdminRole.id },
    });
  }

  // Create branches
  // 'name' is not unique, use 'code' or 'id' for unique where clause
  // Assuming 'code' is unique, we will use code for upsert
  // 'location' field does not exist, use 'address' instead
  const branch1 = await prisma.branch.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: { code: 'MAIN', name: 'Main Branch', address: 'Downtown' },
  });

  // Create users
  // 'email' and 'branchId' fields do not exist in User model, remove them
  const hashedUserPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedUserPassword,
      roleId: superAdminRole.id,
    },
  });

  // Create membership plans
  // 'name' is not unique, use findFirst and create if not found
  let plan1 = await prisma.membershipPlan.findFirst({
    where: { name: 'Basic Plan' },
  });
  if (!plan1) {
    plan1 = await prisma.membershipPlan.create({
      data: {
        name: 'Basic Plan',
        description: 'Basic membership',
        price: 50.0,
        durationDays: 30,
      },
    });
  }

  // Create members
  const hashedMemberPassword = await bcrypt.hash('member123', 10);
  const member = await prisma.member.upsert({
    where: { username: 'member' },
    update: {},
    create: {
      memberCode: 'MEM001',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'MALE',
      email: 'member@gym.com',
      phone: '1234567890',
      username: 'member',
      password: hashedMemberPassword,
      branchId: branch1.id,
    },
  });

  // Create memberships
  // 'id' is autoincrement, use findFirst and create if not found
  let membership = await prisma.membership.findFirst({
    where: { memberId: member.id, planId: plan1.id },
  });
  if (!membership) {
    membership = await prisma.membership.create({
      data: {
        memberId: member.id,
        planId: plan1.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'ACTIVE',
      },
    });
  }

  // Create staff
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.staff.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      staffCode: 'STF001',
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'FEMALE',
      dob: new Date('1990-01-01'),
      email: 'staff@gym.com',
      phone: '0987654321',
      role: 'Trainer',
      joinDate: new Date(),
      salaryType: 'FIXED',
      fixedSalary: 3000.0,
      username: 'staff',
      password: hashedStaffPassword,
      branchId: branch1.id,
      loginAccess: true,
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
