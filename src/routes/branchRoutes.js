const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

router.get('/', authenticateToken, accessControl(), branchController.getBranches);
router.post('/', authenticateToken, accessControl(), checkPermission(['superadmin']), uploadMiddleware, branchController.createBranch);
router.put('/:id', authenticateToken, accessControl(), checkPermission(['superadmin']), uploadMiddleware, branchController.updateBranch);
router.delete('/:id', authenticateToken, accessControl(), checkPermission(['superadmin']), branchController.deleteBranch);

module.exports = router;
