const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { memberUpload } = require('../middlewares/uploadMiddleware');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

router.get('/', authenticateToken, accessControl(), memberController.getMembers);
router.post('/', authenticateToken, checkPermission(['superadmin', 'admin']), memberUpload, memberController.createMember);
router.put('/:id', authenticateToken, accessControl({ includeUserFilter: true }), checkPermission(['superadmin', 'admin']), memberUpload, memberController.updateMember);
router.delete('/:id', authenticateToken, accessControl({ includeUserFilter: true }), checkPermission(['superadmin', 'admin']), memberController.deleteMember);

module.exports = router;
