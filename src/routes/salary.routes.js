import express from 'express';
import {
  getSalaries, recordSalary, updateSalary, deleteSalary, getSalaryById
} from '../controllers/salary.controller.js';

const router = express.Router();
router.get('/', getSalaries);
router.post('/', recordSalary);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);
router.get('/:id', getSalaryById);
export default router;
