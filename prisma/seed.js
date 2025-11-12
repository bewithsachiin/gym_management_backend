const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const superadminPassword = await bcrypt.hash('superadmin123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const generalTrainerPassword = await bcrypt.hash('trainer123', 10);
  const personalTrainerPassword = await bcrypt.hash('ptrainer123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);
  const housekeepingPassword = await bcrypt.hash('house123', 10);
  const receptionistPassword = await bcrypt.hash('reception123', 10);

  // Create superadmin
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@fit.com' },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@fit.com',
      password: superadminPassword,
      role: 'superadmin',
    },
  });

  // Create a branch
  const branch = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Main Branch',
      code: 'MAIN001',
      address: '123 Main St',
      hours: { open: '06:00', close: '22:00' },
      adminId: superadmin.id,
    },
  });

  // Create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fit.com' },
    update: {},
    create: {
      firstName: 'Branch',
      lastName: 'Admin',
      email: 'admin@fit.com',
      password: adminPassword,
      role: 'admin',
      branchId: branch.id,
    },
  });

  // Create general trainer
  const generalTrainer = await prisma.user.upsert({
    where: { email: 'trainer@fit.com' },
    update: {},
    create: {
      firstName: 'General',
      lastName: 'Trainer',
      email: 'trainer@fit.com',
      password: generalTrainerPassword,
      role: 'generaltrainer',
      branchId: branch.id,
    },
  });

  // Create personal trainer
  const personalTrainer = await prisma.user.upsert({
    where: { email: 'ptrainer@fit.com' },
    update: {},
    create: {
      firstName: 'Personal',
      lastName: 'Trainer',
      email: 'ptrainer@fit.com',
      password: personalTrainerPassword,
      role: 'personaltrainer',
      branchId: branch.id,
    },
  });

  // Create member
  const member = await prisma.user.upsert({
    where: { email: 'member@fit.com' },
    update: {},
    create: {
      firstName: 'Gym',
      lastName: 'Member',
      email: 'member@fit.com',
      password: memberPassword,
      role: 'member',
      branchId: branch.id,
    },
  });

  // Create housekeeping
  const housekeeping = await prisma.user.upsert({
    where: { email: 'house@fit.com' },
    update: {},
    create: {
      firstName: 'House',
      lastName: 'Keeping',
      email: 'house@fit.com',
      password: housekeepingPassword,
      role: 'housekeeping',
      branchId: branch.id,
    },
  });

  // Create receptionist
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@fit.com' },
    update: {},
    create: {
      firstName: 'Front',
      lastName: 'Desk',
      email: 'reception@fit.com',
      password: receptionistPassword,
      role: 'receptionist',
      branchId: branch.id,
    },
  });

  // Create staff roles first
  const adminRole = await prisma.staffRole.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Branch Administrator',
    },
  });

  const trainerRole = await prisma.staffRole.upsert({
    where: { name: 'Trainer' },
    update: {},
    create: {
      name: 'Trainer',
      description: 'General Trainer',
    },
  });

  const personalTrainerRole = await prisma.staffRole.upsert({
    where: { name: 'Personal Trainer' },
    update: {},
    create: {
      name: 'Personal Trainer',
      description: 'Personal Trainer',
    },
  });

  const housekeepingRole = await prisma.staffRole.upsert({
    where: { name: 'Housekeeping' },
    update: {},
    create: {
      name: 'Housekeeping',
      description: 'Housekeeping Staff',
    },
  });

  const receptionistRole = await prisma.staffRole.upsert({
    where: { name: 'Receptionist' },
    update: {},
    create: {
      name: 'Receptionist',
      description: 'Receptionist',
    },
  });

  // Create staff entries
  await prisma.staff.upsert({
    where: { userId: generalTrainer.id },
    update: {},
    create: {
      userId: generalTrainer.id,
      branchId: branch.id,
      roleId: trainerRole.id,
      staff_id: 'STAFF001',
      gender: 'Male',
      dob: new Date('1985-03-15'),
      phone: '+1 555-123-4567',
      status: 'Active',
      join_date: new Date('2020-01-15'),
      salary_type: 'Hourly',
      hourly_rate: 35,
      commission_rate_percent: 15,
      login_enabled: true,
      username: 'trainer',
      password: generalTrainerPassword,
      createdById: superadmin.id, // Created by superadmin
    },
  });

  await prisma.staff.upsert({
    where: { userId: personalTrainer.id },
    update: {},
    create: {
      userId: personalTrainer.id,
      branchId: branch.id,
      roleId: personalTrainerRole.id,
      staff_id: 'STAFF002',
      gender: 'Female',
      dob: new Date('1990-07-22'),
      phone: '+1 555-987-6543',
      status: 'Active',
      join_date: new Date('2021-03-10'),
      salary_type: 'Fixed',
      fixed_salary: 60000,
      commission_rate_percent: 0,
      login_enabled: true,
      username: 'ptrainer',
      password: personalTrainerPassword,
      createdById: superadmin.id, // Created by superadmin
    },
  });

  await prisma.staff.upsert({
    where: { userId: housekeeping.id },
    update: {},
    create: {
      userId: housekeeping.id,
      branchId: branch.id,
      roleId: housekeepingRole.id,
      staff_id: 'STAFF003',
      gender: 'Male',
      dob: new Date('1988-11-05'),
      phone: '+1 555-456-7890',
      status: 'Inactive',
      join_date: new Date('2019-08-01'),
      exit_date: new Date('2025-01-31'),
      salary_type: 'Fixed',
      fixed_salary: 35000,
      commission_rate_percent: 0,
      login_enabled: false,
      username: 'house',
      password: housekeepingPassword,
      createdById: admin.id, // Created by admin
    },
  });

  await prisma.staff.upsert({
    where: { userId: receptionist.id },
    update: {},
    create: {
      userId: receptionist.id,
      branchId: branch.id,
      roleId: receptionistRole.id,
      staff_id: 'STAFF004',
      gender: 'Female',
      dob: new Date('1992-05-10'),
      phone: '+1 555-234-5678',
      status: 'Active',
      join_date: new Date('2022-02-01'),
      salary_type: 'Fixed',
      fixed_salary: 40000,
      commission_rate_percent: 0,
      login_enabled: true,
      username: 'reception',
      password: receptionistPassword,
      createdById: receptionist.id, // Created by receptionist (self-created for demo)
    },
  });

  // Member entry not needed as member is just a role in User model

  // Create gym plans (group and personal training)
  const starterGroupPlan = await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Starter Pack',
      type: 'group',
      sessions: 8,
      validity: 30,
      priceCents: 249900, // ₹2,499
      currency: 'INR',
      active: true,
      adminId: superadmin.id,
      branchId: branch.id,
    },
  });

  const proGroupPlan = await prisma.plan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Pro Pack',
      type: 'group',
      sessions: 16,
      validity: 60,
      priceCents: 449900, // ₹4,499
      currency: 'INR',
      active: true,
      adminId: superadmin.id,
      branchId: branch.id,
    },
  });

  const unlimitedGroupPlan = await prisma.plan.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Unlimited',
      type: 'group',
      sessions: 30,
      validity: 90,
      priceCents: 799900, // ₹7,999
      currency: 'INR',
      active: true,
      adminId: superadmin.id,
      branchId: branch.id,
    },
  });

  const basicPersonalPlan = await prisma.plan.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Basic 1:1',
      type: 'personal',
      sessions: 6,
      validity: 30,
      priceCents: 499900, // ₹4,999
      currency: 'INR',
      active: true,
      adminId: superadmin.id,
      branchId: branch.id,
    },
  });

  const advancedPersonalPlan = await prisma.plan.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Advanced 1:1',
      type: 'personal',
      sessions: 12,
      validity: 60,
      priceCents: 899900, // ₹8,999
      currency: 'INR',
      active: true,
      adminId: superadmin.id,
      branchId: branch.id,
    },
  });

  const elitePersonalPlan = await prisma.plan.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Elite 1:1',
      type: 'personal',
      sessions: 20,
      validity: 90,
      priceCents: 1499900, // ₹14,999
      currency: 'INR',
      active: true,
      adminId: superadmin.id,
      branchId: branch.id,
    },
  });

  // Create sample booking requests
  const booking1 = await prisma.planBooking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      memberId: member.id,
      planId: proGroupPlan.id,
      requestedAt: new Date('2025-05-20T10:30:00Z'),
      status: 'pending',
      sessionsUsed: 1,
      note: 'Interested in group training sessions',
    },
  });

  const booking2 = await prisma.planBooking.upsert({
    where: { id: 2 },
    update: {},
    create: {
      memberId: member.id,
      planId: advancedPersonalPlan.id,
      requestedAt: new Date('2025-05-20T11:15:00Z'),
      status: 'approved',
      sessionsUsed: 1,
      note: 'Looking for personal training',
    },
  });

  const booking3 = await prisma.planBooking.upsert({
    where: { id: 3 },
    update: {},
    create: {
      memberId: member.id,
      planId: starterGroupPlan.id,
      requestedAt: new Date('2025-05-19T15:45:00Z'),
      status: 'rejected',
      sessionsUsed: 1,
      note: 'Basic group plan request',
    },
  });

  const booking4 = await prisma.planBooking.upsert({
    where: { id: 4 },
    update: {},
    create: {
      memberId: member.id,
      planId: elitePersonalPlan.id,
      requestedAt: new Date('2025-05-21T09:00:00Z'),
      status: 'pending',
      sessionsUsed: 1,
      note: 'Premium personal training package',
    },
  });

  // Create active member plan for approved booking
  const memberPlan = await prisma.memberPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      memberId: member.id,
      planId: advancedPersonalPlan.id,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      remainingSessions: 11, // 12 - 1 used
    },
  });

  // Create sample classes
  const yogaClass = await prisma.classSchedule.upsert({
    where: { id: 1 },
    update: {},
    create: {
      class_name: 'Morning Yoga',
      trainer_id: generalTrainer.id,
      date: new Date('2024-01-15'),
      time: '07:00 - 08:00',
      schedule_day: ['Monday', 'Wednesday', 'Friday'],
      total_sheets: 20,
      status: 'Active',
      branchId: branch.id,
      adminId: admin.id,
    },
  });

  const cardioClass = await prisma.classSchedule.upsert({
    where: { id: 2 },
    update: {},
    create: {
      class_name: 'HIIT Cardio',
      trainer_id: personalTrainer.id,
      date: new Date('2024-01-16'),
      time: '18:00 - 19:00',
      schedule_day: ['Tuesday', 'Thursday'],
      total_sheets: 15,
      status: 'Active',
      branchId: branch.id,
      adminId: admin.id,
    },
  });

  const strengthClass = await prisma.classSchedule.upsert({
    where: { id: 3 },
    update: {},
    create: {
      class_name: 'Strength Training',
      trainer_id: generalTrainer.id,
      date: new Date('2024-01-17'),
      time: '10:00 - 11:30',
      schedule_day: ['Saturday'],
      total_sheets: 12,
      status: 'Active',
      branchId: branch.id,
      adminId: admin.id,
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
