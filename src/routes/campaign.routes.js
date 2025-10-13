import express from 'express';
import {
  getCampaigns, createCampaign, updateCampaignStatus, deleteCampaign, getCampaignById
} from '../controllers/campaign.controller.js';

const router = express.Router();
router.get('/', getCampaigns);
router.post('/', createCampaign);
router.put('/:id/status', updateCampaignStatus);
router.delete('/:id', deleteCampaign);
router.get('/:id', getCampaignById);
export default router;
