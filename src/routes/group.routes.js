import express from 'express';
import multer from 'multer';
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupById
} from '../controllers/group.controller.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/', getGroups);
router.post('/', upload.single('photo'), createGroup);
router.put('/:id', upload.single('photo'), updateGroup);
router.delete('/:id', deleteGroup);
router.get('/:id', getGroupById);

export default router;
