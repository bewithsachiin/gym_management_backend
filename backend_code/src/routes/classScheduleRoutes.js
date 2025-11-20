const express = require('express');
const router = express.Router();
const classScheduleController = require('../controllers/classScheduleController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

// GET /api/v1/classes - List all classes (filtered by branch)
router.get('/', authenticateToken, accessControl(), classScheduleController.getClasses);

// GET /api/v1/classes/:id - Get single class
router.get('/:id', authenticateToken, accessControl(), classScheduleController.getClass);

// POST /api/v1/classes - Create new class
router.post('/', authenticateToken, checkPermission(['superadmin', 'admin']), classScheduleController.createClass);

// PUT /api/v1/classes/:id - Update class
router.put('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), classScheduleController.updateClass);

// DELETE /api/v1/classes/:id - Delete class
router.delete('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), classScheduleController.deleteClass);

// GET /api/v1/classes/trainers - Get trainers
router.get('/trainers', authenticateToken, accessControl(), classScheduleController.getTrainers);

module.exports = router;
