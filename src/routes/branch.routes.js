import express from 'express';
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchById,
} from '../controllers/branch.controller.js';

const router = express.Router();

router.get('/', getBranches);
router.post('/', createBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);
router.get('/:id', getBranchById);

export default router;
