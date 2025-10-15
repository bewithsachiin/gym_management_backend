import express from 'express';
const router = express.Router();
import {
    addSession,
    getAllSessions,
    getSessionById,
    rescheduleSession,
    deleteSession

} from '../controllers/session.controller.js';

//================add session==================
router.post('/', addSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.put('/:id', rescheduleSession);
router.patch('/:id', rescheduleSession);
router.delete('/:id', deleteSession);

export default router;