const express = require('express');
const router = express.Router();
const classScheduleController = require('../controllers/classScheduleController');
const { authenticateToken, authorizeClassAccess } = require('../middlewares/auth.middleware');

// GET /api/v1/classes - List all classes (filtered by branch)
router.get('/', authenticateToken, authorizeClassAccess('read'), classScheduleController.getClasses);

// GET /api/v1/classes/:id - Get single class
router.get('/:id', authenticateToken, authorizeClassAccess('read'), classScheduleController.getClass);

// POST /api/v1/classes - Create new class
router.post('/', authenticateToken, authorizeClassAccess('create'), classScheduleController.createClass);

// PUT /api/v1/classes/:id - Update class
router.put('/:id', authenticateToken, authorizeClassAccess('update'), classScheduleController.updateClass);

// DELETE /api/v1/classes/:id - Delete class
router.delete('/:id', authenticateToken, authorizeClassAccess('delete'), classScheduleController.deleteClass);

module.exports = router;
