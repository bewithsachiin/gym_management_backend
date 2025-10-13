import express from 'express';
import {
  getStaff, getStaffById, createStaff, updateStaff, deleteStaff, changeStaffPassword,
} from '../controllers/staff.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();
router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', upload.single('profilePhoto'), createStaff);
router.put('/:id', upload.single('profilePhoto'), updateStaff);
router.delete('/:id', deleteStaff);
router.put('/:id/change-password', changeStaffPassword);

export default router;
