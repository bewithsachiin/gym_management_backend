const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { groupUpload } = require('../middlewares/uploadMiddleware');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

// Groups routes with centralized access control
router.get('/', authenticateToken, accessControl(), groupController.getGroups);
router.get('/:id', authenticateToken, accessControl(), groupController.getGroup);
router.post('/', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), groupUpload, groupController.createGroup);
router.put('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), groupUpload, groupController.updateGroup);
router.delete('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), groupController.deleteGroup);

module.exports = router;
