const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://gym_user:gym_secure_password_2024@localhost:3320/gym_management'
    }
  }
});

async function enableLoginForAll() {
  try {
    console.log('=== Enabling Login for All Users ===\n');

    const result = await prisma.user.updateMany({
      data: {
        loginEnabled: true
      }
    });

    console.log(`✅ Updated ${result.count} users`);
    console.log('   All users now have loginEnabled = true\n');

    // Verify
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        loginEnabled: true
      }
    });

    console.log('Verification:');
    console.log('─'.repeat(60));
    users.forEach(user => {
      const status = user.loginEnabled ? '✅' : '❌';
      console.log(`${status} ${user.email} (${user.role})`);
    });

    console.log('\n✅ All users can now login!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

enableLoginForAll();
