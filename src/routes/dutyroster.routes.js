import express from 'express';
import {
  getDutyRoster, createDutyShift, updateDutyShift, deleteDutyShift, getDutyShiftById, approveDutyShift
} from '../controllers/dutyroster.controller.js';

const router = express.Router();
router.get('/', getDutyRoster);
router.post('/', createDutyShift);
router.put('/:shift_id', updateDutyShift);
router.delete('/:shift_id', deleteDutyShift);
router.get('/:shift_id', getDutyShiftById);
router.patch('/:shift_id/approve', approveDutyShift);
export default router;
