// Auth Middleware - Simple functions with detailed logging
const { verifyToken } = require('../utils/jwt');

// ============================================
// AUTHENTICATE TOKEN
// ============================================
function authenticateToken(req, res, next) {
  console.log('\n🔐 [AUTH MIDDLEWARE] Authenticating token...');

  try {
    // Step 1: Get token from header
    console.log('🔍 Step 1: Extracting token from header...');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('❌ No token provided in request');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    console.log('✅ Token found in header');

    // Step 2: Verify token
    console.log('🔍 Step 2: Verifying token...');
    const decoded = verifyToken(token);

    console.log('✅ Token verified successfully');
    console.log('👤 User details:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      branchId: decoded.branchId
    });

    // Step 3: Attach user to request
    req.user = decoded;

    console.log('✅ User attached to request');
    console.log('🎉 [AUTH MIDDLEWARE] Authentication successful\n');

    next();

  } catch (error) {
    console.log('❌ [AUTH MIDDLEWARE] Authentication failed:', error.message);
    console.log('📋 Error details:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}

// ============================================
// AUTHORIZE ROLES
// ============================================
function authorizeRoles(...roles) {
  return (req, res, next) => {
    console.log('\n🔒 [AUTH MIDDLEWARE] Checking role authorization...');
    console.log('✅ Required roles:', roles);
    console.log('👤 User role:', req.user?.role);

    if (!req.user || !roles.includes(req.user.role)) {
      console.log('❌ Role authorization failed');
      console.log(`🚫 User role "${req.user?.role}" not in required roles: ${roles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    console.log('✅ Role authorization successful');
    console.log('🎉 [AUTH MIDDLEWARE] User authorized\n');
    next();
  };
}

// ============================================
// AUTHORIZE BRANCH
// ============================================
function authorizeBranch(req, res, next) {
  console.log('\n🏢 [AUTH MIDDLEWARE] Checking branch authorization...');

  const { branchId } = req.user;
  const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;

  console.log('👤 User branch ID:', branchId);
  console.log('🔍 Requested branch ID:', requestedBranchId);

  // SUPERADMIN can access all branches
  if (req.user.role === 'superadmin') {
    console.log('✅ SuperAdmin - branch access granted');
    console.log('🎉 [AUTH MIDDLEWARE] Branch authorization successful\n');
    return next();
  }

  // For other roles, enforce branch isolation
  if (!branchId || (requestedBranchId && requestedBranchId != branchId)) {
    console.log('❌ Branch authorization failed');
    console.log(`🚫 User branch: ${branchId}, Requested: ${requestedBranchId}`);
    return res.status(403).json({
      success: false,
      message: 'Access denied: Branch isolation enforced'
    });
  }

  console.log('✅ Branch authorization successful');
  console.log('🎉 [AUTH MIDDLEWARE] Branch access granted\n');
  next();
}

// ============================================
// AUTHORIZE CLASS ACCESS
// ============================================
function authorizeClassAccess(action) {
  return (req, res, next) => {
    console.log('\n📚 [AUTH MIDDLEWARE] Checking class access...');
    console.log('🎬 Action:', action);

    const userRole = req.user.role;
    const userBranchId = req.user.branchId;

    console.log('👤 User role:', userRole);
    console.log('🏢 User branch:', userBranchId);

    // SUPERADMIN: full access
    if (userRole === 'superadmin') {
      console.log('✅ SuperAdmin - full class access granted');
      console.log('🎉 [AUTH MIDDLEWARE] Class access granted\n');
      return next();
    }

    // ADMIN: CRUD on own branch
    if (userRole === 'admin' && userBranchId) {
      if (action === 'read' || action === 'create' || action === 'update' || action === 'delete') {
        console.log(`✅ Admin - ${action} access granted`);
        console.log('🎉 [AUTH MIDDLEWARE] Class access granted\n');
        return next();
      }
    }

    // TRAINERS and RECEPTIONIST: read-only on own branch
    if ((userRole === 'generaltrainer' || userRole === 'personaltrainer' || userRole === 'receptionist') && userBranchId) {
      if (action === 'read') {
        console.log(`✅ ${userRole} - read access granted`);
        console.log('🎉 [AUTH MIDDLEWARE] Class access granted\n');
        return next();
      }
    }

    console.log('❌ Class access denied');
    console.log(`🚫 Role: ${userRole}, Action: ${action}`);
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions for this action'
    });
  };
}

// Export all functions
module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeBranch,
  authorizeClassAccess,
};
