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
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
};

const authorizeBranch = (req, res, next) => {
  const { branchId } = req.user;
  const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;

  // SUPERADMIN can access all branches
  if (req.user.role === 'superadmin') {
    return next();
  }

  // For other roles, enforce branch isolation
  if (!branchId || (requestedBranchId && requestedBranchId != branchId)) {
    return res.status(403).json({ success: false, message: 'Access denied: Branch isolation enforced' });
  }

  next();
};

const authorizeClassAccess = (action) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userBranchId = req.user.branchId;

    // SUPERADMIN: full access
    if (userRole === 'superadmin') {
      return next();
    }

    // ADMIN: CRUD on own branch
    if (userRole === 'admin' && userBranchId) {
      if (action === 'read' || action === 'create' || action === 'update' || action === 'delete') {
        return next();
      }
    }

    // TRAINERS and RECEPTIONIST: read-only on own branch
    if ((userRole === 'GENERALTRAINER' || userRole === 'PERSONALTRAINER' || userRole === 'RECEPTIONIST') && userBranchId) {
      if (action === 'read') {
        return next();
      }
    }

    return res.status(403).json({ success: false, message: 'Insufficient permissions for this action' });
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeBranch,
  authorizeClassAccess,
};
