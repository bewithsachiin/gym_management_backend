const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://gym_user:gym_secure_password_2024@localhost:3320/gym_management'
    }
  }
});

async function resetAllPasswords() {
  try {
    console.log('=== Resetting All User Passwords ===\n');

    const users = [
      { email: 'superadmin@fit.com', password: 'SuperAdmin@123', role: 'superadmin' },
      { email: 'admin@fit.com', password: 'Admin@123', role: 'admin' },
      { email: 'admin2@fit.com', password: 'Admin@123', role: 'admin' },
      { email: 'admin3@fit.com', password: 'Admin@123', role: 'admin' },
      { email: 'admin4@fit.com', password: 'Admin@123', role: 'admin' },
      { email: 'trainer@fit.com', password: 'Trainer@123', role: 'generaltrainer' },
      { email: 'ptrainer@fit.com', password: 'Trainer@123', role: 'personaltrainer' },
      { email: 'member@fit.com', password: 'Member@123', role: 'member' },
      { email: 'house@fit.com', password: 'House@123', role: 'housekeeping' },
      { email: 'reception@fit.com', password: 'Reception@123', role: 'receptionist' },
      { email: 'member2@fit.com', password: 'Member@123', role: 'member' },
    ];

    console.log('Updating passwords...\n');

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await prisma.user.update({
        where: { email: userData.email },
        data: {
          password: hashedPassword,
          loginEnabled: true
        }
      });

      console.log(`✅ ${userData.email.padEnd(25)} → ${userData.password} (${userData.role})`);
    }

    console.log('\n✅ All passwords updated!\n');
    console.log('─'.repeat(70));
    console.log('CREDENTIALS:');
    console.log('─'.repeat(70));
    users.forEach(u => {
      console.log(`${u.role.padEnd(18)} | ${u.email.padEnd(25)} | ${u.password}`);
    });
    console.log('─'.repeat(70));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllPasswords();
