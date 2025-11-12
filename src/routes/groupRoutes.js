const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { memberUpload } = require('../middleware/uploadMiddleware');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, authorizeRoles('ADMIN', 'SUPERADMIN'), groupController.getGroups);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'SUPERADMIN'), groupController.getGroup);
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'SUPERADMIN'), memberUpload, groupController.createGroup);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'SUPERADMIN'), memberUpload, groupController.updateGroup);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN', 'SUPERADMIN'), groupController.deleteGroup);

module.exports = router;
