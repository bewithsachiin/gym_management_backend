import express from 'express';
import { uploadImage } from '../middleware/upload.middleware.js';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  changeMemberPassword
} from '../controllers/member.controller.js';

const router = express.Router();

// Member routes
router.get('/', getMembers);
router.get('/:id', getMemberById);

// Use 'member_image' as the field name in form-data
router.post('/', uploadImage("gym_members").single('member_image'), createMember);
router.put('/:id', uploadImage("gym_members").single('member_image'), updateMember);

router.put('/:id/change-password', changeMemberPassword);
router.delete('/:id', deleteMember);

export default router;
