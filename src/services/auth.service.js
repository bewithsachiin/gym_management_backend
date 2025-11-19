// Auth Service - Simple functions with detailed console logs
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { sendResetOtpEmail } = require('../utils/nodemailer');

// ============================================
// LOGIN FUNCTION
// ============================================
async function login(email, password) {
  console.log('\n🔐 [AUTH SERVICE] Starting login process...');
  console.log('📧 Email:', email);

  try {
    // Step 1: Find user by email
    console.log('🔍 Step 1: Searching for user in database...');
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        branch: true,
      },
    });

    if (!user) {
      console.log('❌ User not found with email:', email);
      throw new Error('Invalid email or password');
    }

    console.log('✅ User found:', {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      branchId: user.branchId
    });

    // Step 2: Verify password
    console.log('🔍 Step 2: Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      throw new Error('Invalid email or password');
    }

    console.log('✅ Password verified successfully');

    // Step 3: Generate JWT token
    console.log('🔍 Step 3: Generating JWT token...');
    const tokenPayload = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
    };

    const token = generateToken(tokenPayload);
    console.log('✅ JWT token generated successfully');

    // Step 4: Prepare response
    console.log('🔍 Step 4: Preparing response data...');
    const response = {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        branch: user.branch ? {
          id: user.branch.id,
          name: user.branch.name,
          code: user.branch.code,
          address: user.branch.address,
          phone: user.branch.phone,
          email: user.branch.email,
          status: user.branch.status,
        } : null,
      },
      token,
    };

    console.log('✅ Login successful for user:', user.email);
    console.log('🎉 [AUTH SERVICE] Login process completed\n');

    return response;

  } catch (error) {
    console.log('❌ [AUTH SERVICE] Login failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw error;
  }
}

// ============================================
// SIGNUP FUNCTION
// ============================================
async function signup(firstName, lastName, email, password, confirmPassword) {
  console.log('\n📝 [AUTH SERVICE] Starting signup process...');
  console.log('📧 Email:', email);
  console.log('👤 Name:', firstName, lastName);

  try {
    // Step 1: Validate passwords match
    console.log('🔍 Step 1: Validating passwords...');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      throw new Error('Passwords do not match');
    }
    console.log('✅ Passwords match');

    // Step 2: Check if email already exists
    console.log('🔍 Step 2: Checking if email already exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Email already exists:', email);
      throw new Error('Email already exists');
    }
    console.log('✅ Email is available');

    // Step 3: Hash password
    console.log('🔍 Step 3: Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    // Step 4: Create new user
    console.log('🔍 Step 4: Creating new user in database...');
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'member',
      },
    });

    console.log('✅ User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    // Step 5: Generate JWT token
    console.log('🔍 Step 5: Generating JWT token...');
    const token = generateToken({
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
      branchId: newUser.branchId,
    });
    console.log('✅ JWT token generated successfully');

    // Step 6: Prepare response
    const response = {
      success: true,
      message: 'Signup successful',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };

    console.log('✅ Signup successful for user:', newUser.email);
    console.log('🎉 [AUTH SERVICE] Signup process completed\n');

    return response;

  } catch (error) {
    console.log('❌ [AUTH SERVICE] Signup failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw error;
  }
}

// ============================================
// FORGOT PASSWORD FUNCTION
// ============================================
async function forgotPassword(email) {
  console.log('\n🔑 [AUTH SERVICE] Starting forgot password process...');
  console.log('📧 Email:', email);

  try {
    // Step 1: Find user by email
    console.log('🔍 Step 1: Searching for user...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found with email:', email);
      throw new Error('User not found');
    }

    console.log('✅ User found:', user.email);

    // Step 2: Generate OTP
    console.log('🔍 Step 2: Generating OTP...');
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    console.log('✅ OTP generated:', otp);
    console.log('⏰ OTP expires at:', otpExpiry);

    // Step 3: Store OTP in database (using a temporary field or separate table)
    console.log('🔍 Step 3: Storing OTP in database...');
    // Note: You might want to create a separate OTP table or use a temporary field
    // For now, we'll store it in memory or you can add fields to User model
    console.log('⚠️  Note: OTP storage needs to be implemented based on your schema');

    // Step 4: Send OTP email
    console.log('🔍 Step 4: Sending OTP email...');
    await sendResetOtpEmail(email, otp);
    console.log('✅ OTP email sent successfully');

    const response = {
      success: true,
      message: 'Reset OTP sent to your email',
      email: email,
    };

    console.log('🎉 [AUTH SERVICE] Forgot password process completed\n');
    return response;

  } catch (error) {
    console.log('❌ [AUTH SERVICE] Forgot password failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw error;
  }
}

// ============================================
// RESET PASSWORD FUNCTION
// ============================================
async function resetPassword(email, otp, newPassword) {
  console.log('\n🔄 [AUTH SERVICE] Starting reset password process...');
  console.log('📧 Email:', email);
  console.log('🔢 OTP:', otp);

  try {
    // Step 1: Find user
    console.log('🔍 Step 1: Finding user...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found');
      throw new Error('User not found');
    }

    console.log('✅ User found:', user.email);

    // Step 2: Verify OTP
    console.log('🔍 Step 2: Verifying OTP...');
    // Note: OTP verification logic needs to be implemented
    console.log('⚠️  Note: OTP verification needs to be implemented');

    // Step 3: Hash new password
    console.log('🔍 Step 3: Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('✅ Password hashed successfully');

    // Step 4: Update password
    console.log('🔍 Step 4: Updating password in database...');
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('✅ Password updated successfully');

    const response = {
      success: true,
      message: 'Password reset successful',
    };

    console.log('🎉 [AUTH SERVICE] Reset password process completed\n');
    return response;

  } catch (error) {
    console.log('❌ [AUTH SERVICE] Reset password failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw error;
  }
}

// Export all functions
module.exports = {
  login,
  signup,
  forgotPassword,
  resetPassword,
};
