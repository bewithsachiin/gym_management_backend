const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://gym_user:gym_secure_password_2024@localhost:3320/gym_management'
    }
  }
});

async function checkUsers() {
  try {
    console.log('=== Checking Gym Database Users ===\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        branchId: true,
        loginEnabled: true
      },
      take: 20
    });

    console.log(`Total users found: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ No users in database!\n');
      console.log('Creating superadmin user...');

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);

      const newUser = await prisma.user.create({
        data: {
          firstName: 'Super',
          lastName: 'Admin',
          email: 'superadmin@fit.com',
          password: hashedPassword,
          role: 'superadmin',
          loginEnabled: true
        }
      });

      console.log('✅ Superadmin created:', newUser.email);
    } else {
      console.log('Users in database:');
      console.log('─'.repeat(80));

      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Login Enabled: ${user.loginEnabled ? 'Yes' : 'No'}`);
        console.log(`   Branch ID: ${user.branchId || 'None'}`);
        console.log('');
      });
    }

    // Check for superadmin
    const superadmin = users.find(u => u.email === 'superadmin@fit.com' || u.role === 'superadmin');

    if (!superadmin) {
      console.log('\n⚠️  No superadmin found! Creating one...');

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);

      const newUser = await prisma.user.create({
        data: {
          firstName: 'Super',
          lastName: 'Admin',
          email: 'superadmin@fit.com',
          password: hashedPassword,
          role: 'superadmin',
          loginEnabled: true
        }
      });

      console.log('✅ Superadmin created:', newUser.email);
      console.log('   Password: SuperAdmin@123');
    } else {
      console.log('\n✅ Superadmin exists:', superadmin.email);
      console.log('   Login Enabled:', superadmin.loginEnabled ? 'Yes' : 'No');
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
