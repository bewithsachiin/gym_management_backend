// Auth Controller - Simple functions with detailed logging
const authService = require('../services/auth.service');

// ============================================
// LOGIN CONTROLLER
// ============================================
async function login(req, res) {
  console.log('\n🎯 [AUTH CONTROLLER] Login endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const { email, password } = req.body;

    // Validate input
    console.log('🔍 Validating input...');
    if (!email || !password) {
      console.log('❌ Validation failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    console.log('✅ Input validation passed');
    console.log('📞 Calling auth service login...');

    // Call service
    const result = await authService.login(email, password);

    console.log('✅ Login successful, sending response');
    res.status(200).json(result);

  } catch (error) {
    console.log('❌ [AUTH CONTROLLER] Login error:', error.message);
    console.log('📋 Error details:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
}

// ============================================
// SIGNUP CONTROLLER
// ============================================
async function signup(req, res) {
  console.log('\n🎯 [AUTH CONTROLLER] Signup endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate required fields
    console.log('🔍 Validating input...');
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    console.log('✅ Input validation passed');
    console.log('📞 Calling auth service signup...');

    // Call service
    const result = await authService.signup(firstName, lastName, email, password, confirmPassword);

    console.log('✅ Signup successful, sending response');
    res.status(201).json(result);

  } catch (error) {
    console.log('❌ [AUTH CONTROLLER] Signup error:', error.message);
    console.log('📋 Error details:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Signup failed',
    });
  }
}

// ============================================
// FORGOT PASSWORD CONTROLLER
// ============================================
async function forgotPassword(req, res) {
  console.log('\n🎯 [AUTH CONTROLLER] Forgot password endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const { email } = req.body;

    // Validate email
    console.log('🔍 Validating input...');
    if (!email) {
      console.log('❌ Validation failed: Missing email');
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    console.log('✅ Input validation passed');
    console.log('📞 Calling auth service forgotPassword...');

    // Call service
    const result = await authService.forgotPassword(email);

    console.log('✅ Forgot password successful, sending response');
    res.status(200).json(result);

  } catch (error) {
    console.log('❌ [AUTH CONTROLLER] Forgot password error:', error.message);
    console.log('📋 Error details:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send reset OTP',
    });
  }
}

// ============================================
// RESET PASSWORD CONTROLLER
// ============================================
async function resetPassword(req, res) {
  console.log('\n🎯 [AUTH CONTROLLER] Reset password endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const { email, otp, newPassword } = req.body;

    // Validate required fields
    console.log('🔍 Validating input...');
    if (!email || !otp || !newPassword) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required',
      });
    }

    console.log('✅ Input validation passed');
    console.log('📞 Calling auth service resetPassword...');

    // Call service
    const result = await authService.resetPassword(email, otp, newPassword);

    console.log('✅ Reset password successful, sending response');
    res.status(200).json(result);

  } catch (error) {
    console.log('❌ [AUTH CONTROLLER] Reset password error:', error.message);
    console.log('📋 Error details:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Password reset failed',
    });
  }
}

// Export all functions
module.exports = {
  login,
  signup,
  forgotPassword,
  resetPassword,
};
