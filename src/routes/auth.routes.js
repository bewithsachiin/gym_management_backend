import express from 'express';
const router = express.Router();

import authController from '../controllers/auth.controller.js';

router.post('/login/user', authController.loginUser);
router.post('/login/member', authController.loginMember);
router.post('/login/staff', authController.loginStaff);

export default router;
