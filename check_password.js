const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://gym_user:gym_secure_password_2024@localhost:3320/gym_management'
    }
  }
});

async function checkPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'superadmin@fit.com' },
      select: {
        email: true,
        password: true,
        role: true,
        loginEnabled: true
      }
    });

    console.log('User found:', user.email);
    console.log('Role:', user.role);
    console.log('Login Enabled:', user.loginEnabled);
    console.log('Password hash:', user.password.substring(0, 30) + '...');
    console.log('');

    // Test password
    const testPasswords = [
      'SuperAdmin@123',
      'superadmin123',
      'admin123',
      'password123',
      '123456'
    ];

    console.log('Testing passwords:');
    for (const pwd of testPasswords) {
      const match = await bcrypt.compare(pwd, user.password);
      console.log(`  ${match ? '✅' : '❌'} "${pwd}"`);
      if (match) {
        console.log(`\n✅ CORRECT PASSWORD: "${pwd}"\n`);
        break;
      }
    }

    // Reset to known password
    console.log('\nResetting password to: SuperAdmin@123');
    const newHash = await bcrypt.hash('SuperAdmin@123', 10);

    await prisma.user.update({
      where: { email: 'superadmin@fit.com' },
      data: { password: newHash }
    });

    console.log('✅ Password updated successfully');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword();
