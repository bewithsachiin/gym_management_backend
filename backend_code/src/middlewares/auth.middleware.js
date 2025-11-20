const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log(`🔑 Token authenticated - User: ${decoded.id}, Role: ${decoded.role}, Branch: ${decoded.branchId || 'N/A'}`);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(`🚫 Role authorization failed - Required: ${roles.join(', ')}, User: ${req.user?.role}`);
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    console.log(`✅ Role authorized - Role: ${req.user.role}`);
    next();
  };
};

const authorizeBranch = (req, res, next) => {
  const { branchId } = req.user;
  const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;

  // SUPERADMIN can access all branches
  if (req.user.role === 'superadmin') {
    console.log(`✅ SuperAdmin branch access granted`);
    return next();
  }

  // For other roles, enforce branch isolation
  if (!branchId || (requestedBranchId && requestedBranchId != branchId)) {
    console.log(`🚫 Branch authorization failed - User branch: ${branchId}, Requested: ${requestedBranchId}`);
    return res.status(403).json({ success: false, message: 'Access denied: Branch isolation enforced' });
  }

  console.log(`✅ Branch authorized - Branch: ${branchId}`);
  next();
};

const authorizeClassAccess = (action) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userBranchId = req.user.branchId;

    // SUPERADMIN: full access
    if (userRole === 'superadmin') {
      console.log(`✅ SuperAdmin class access granted for ${action}`);
      return next();
    }

    // ADMIN: CRUD on own branch
    if (userRole === 'admin' && userBranchId) {
      if (action === 'read' || action === 'create' || action === 'update' || action === 'delete') {
        console.log(`✅ Admin class access granted for ${action}`);
        return next();
      }
    }

    // TRAINERS and RECEPTIONIST: read-only on own branch
    if ((userRole === 'generaltrainer' || userRole === 'personaltrainer' || userRole === 'receptionist') && userBranchId) {
      if (action === 'read') {
        console.log(`✅ Staff class read access granted`);
        return next();
      }
    }

    console.log(`🚫 Class access denied - Role: ${userRole}, Action: ${action}`);
    return res.status(403).json({ success: false, message: 'Insufficient permissions for this action' });
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeBranch,
  authorizeClassAccess,
};
