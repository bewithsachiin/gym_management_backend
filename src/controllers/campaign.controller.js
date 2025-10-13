import { prisma } from '../config/db.config.js';

export const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(campaigns);
  } catch (err) { next(err); }
};

export const createCampaign = async (req, res, next) => {
  try {
    const { title, message, type, target } = req.body; // type: email/sms
    const campaign = await prisma.campaign.create({
      data: {
        title,
        message,
        type,
        target,
        status: 'scheduled',
        createdAt: new Date(),
      },
    });
    res.json(campaign);
  } catch (err) { next(err); }
};

export const updateCampaignStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.campaign.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    await prisma.campaign.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
export const getCampaignById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const campaign = await prisma.campaign.findUnique({ where: { id: Number(id) } });
        if(!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.json(campaign);
    }catch(err){
        next(err);
    }
}