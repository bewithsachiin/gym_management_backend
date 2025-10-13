import express from 'express';
import {
  registerStaff,
  loginStaff,
  registerMember,
  loginMember,
  loginUser,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Staff Auth
router.post('/staff/register', registerStaff);
router.post('/staff/login', loginStaff);

// Member Auth
router.post('/member/register', registerMember);
router.post('/member/login', loginMember);

// User Auth (for admin/superadmin)
router.post('/login/user', loginUser);
router.post('/login/member', loginMember);
router.post('/login/staff', loginStaff);

export default router;
