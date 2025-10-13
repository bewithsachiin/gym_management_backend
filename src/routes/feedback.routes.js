import express from 'express';
import { getFeedbacks, getFeedbackById, createFeedback, updateFeedback, deleteFeedback } from '../controllers/feedback.controller.js';

const router = express.Router();
router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
