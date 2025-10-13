import express from 'express';
import {
  getMembers, getMemberById, createMember, updateMember, deleteMember, changeMemberPassword
} from '../controllers/member.controller.js';
import upload from '../middleware/upload.middleware.js';
import { verifyStaffToken } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(verifyStaffToken); // Protect all member routes
router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/', upload.single('memberImage'), createMember);
router.put('/:id', upload.single('memberImage'), updateMember);
router.put('/:id/change-password', changeMemberPassword);
router.delete('/:id', deleteMember);

export default router;
