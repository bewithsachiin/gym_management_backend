import express from 'express';
const router = express.Router();

import {
    createSalaryRecord,
    getAllSalaryRecords,
    getSalaryRecordById,
    updateSalaryRecord,
    deleteSalaryRecord
} from '../controllers/salaryrecord.controller.js';

router.post('/', createSalaryRecord);
router.get('/', getAllSalaryRecords);
router.get('/:id', getSalaryRecordById);
router.put('/:id', updateSalaryRecord);
router.patch('/:id', updateSalaryRecord);
router.delete('/:id', deleteSalaryRecord);

export default router;