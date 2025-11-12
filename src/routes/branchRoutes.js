const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { authenticateToken, authorizeRoles, authorizeBranch } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, branchController.getBranches);
router.post('/', authenticateToken, authorizeRoles('superadmin'), uploadMiddleware, branchController.createBranch);
router.put('/:id', authenticateToken, authorizeRoles('superadmin'), uploadMiddleware, branchController.updateBranch);
router.delete('/:id', authenticateToken, authorizeRoles('superadmin'), branchController.deleteBranch);

module.exports = router;
