import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const superAdminRole = await prisma.role.upsert({
    where: { role_name: 'SuperAdmin' },
    update: {},
    create: { role_name: 'SuperAdmin' },
  });

  const adminRole = await prisma.role.upsert({
    where: { role_name: 'Admin' },
    update: {},
    create: { role_name: 'Admin' },
  });

  const managerRole = await prisma.role.upsert({
    where: { role_name: 'Manager' },
    update: {},
    create: { role_name: 'Manager' },
  });

  const trainerRole = await prisma.role.upsert({
    where: { role_name: 'GeneralTrainer' },
    update: {},
    create: { role_name: 'GeneralTrainer' },
  });

  // Permissions not implemented in schema, skipping

  // Create branches
  // 'name' is not unique, use 'code' or 'id' for unique where clause
  // Assuming 'code' is unique, we will use code for upsert
  // 'location' field does not exist, use 'address' instead
  const branch1 = await prisma.branch.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: { code: 'MAIN', name: 'Main Branch', address: 'Downtown' },
  });

  // Create admin staff
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const adminStaff = await prisma.staff.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      staff_id: 'ADM001',
      first_name: 'Admin',
      last_name: 'User',
      gender: 'MALE',
      dob: new Date('1990-01-01'),
      email: 'admin@gym.com',
      phone: '1111111111',
      username: 'admin',
      password: hashedAdminPassword,
      role_id: superAdminRole.id,
      branch_id: branch1.id,
      login_enabled: true,
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
        duration_days: 30,
      },
    });
  }

  // Create members
  const hashedMemberPassword = await bcrypt.hash('member123', 10);
  const member = await prisma.member.upsert({
    where: { username: 'member' },
    update: {},
    create: {
      member_code: 'MEM001',
      first_name: 'John',
      last_name: 'Doe',
      gender: 'MALE',
      email: 'member@gym.com',
      phone: '1234567890',
      username: 'member',
      password: hashedMemberPassword,
      branch_id: branch1.id,
    },
  });

  // Create memberships
  // 'id' is autoincrement, use findFirst and create if not found
  let membership = await prisma.membership.findFirst({
    where: { member_id: member.id, plan_id: plan1.id },
  });
  if (!membership) {
    membership = await prisma.membership.create({
      data: {
        member_id: member.id,
        plan_id: plan1.id,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'ACTIVE',
      },
    });
  }

  // Create staff
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.staff.upsert({
    where: { username: 'staff' },
    update: { role_id: trainerRole.id },
    create: {
      staff_id: 'STF001',
      first_name: 'Jane',
      last_name: 'Smith',
      gender: 'FEMALE',
      dob: new Date('1990-01-01'),
      email: 'staff@gym.com',
      phone: '0987654321',
      role_id: trainerRole.id,
      role: 'Trainer',
      join_date: new Date(),
      salary_type: 'FIXED',
      fixed_salary: 3000.0,
      username: 'staff',
      password: hashedStaffPassword,
      branch_id: branch1.id,
      login_enabled: true,
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
