import express from 'express';
import { getPlans, createPlan, updatePlan, deletePlan, getPlanById } from '../controllers/plan.controller.js';

const router = express.Router();
router.get('/', getPlans);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);
router.get('/:id', getPlanById);


export default router;
