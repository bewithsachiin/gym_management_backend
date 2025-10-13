import { prisma } from '../config/db.config.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json(plans);
  } catch (err) { next(err); }
};

export const createPlan = async (req, res, next) => {
  try {
    const { name, sessions, validity, price, type } = req.body;
    const plan = await prisma.plan.create({
      data: { name, sessions: Number(sessions), validity: Number(validity), price: Number(price), type },
    });
    res.json(plan);
  } catch (err) { next(err); }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sessions, validity, price, type, active } = req.body;
    const updated = await prisma.plan.update({
      where: { id: Number(id) },
      data: { name, sessions: Number(sessions), validity: Number(validity), price: Number(price), type, active },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deletePlan = async (req, res, next) => {
  try {
    await prisma.plan.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
export const getPlanById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const plan = await prisma.plan.findUnique({ where: { id: Number(id) } });
        if(!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch(err){
        next(err);
    }
}