import { prisma } from '../config/db.config.js';

export const getBranches = async (req, res, next) => {
  try {
    const branches = await prisma.branch.findMany();
    res.json(branches);
  } catch (err) {
    next(err);
  }
};

export const createBranch = async (req, res, next) => {
  try {
    const { name, address, phone } = req.body;
    const newBranch = await prisma.branch.create({
      data: { name, address, phone, },
    });
    res.json(newBranch);
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    const updated = await prisma.branch.update({
      where: { id: Number(id) },
      data: { name, address, phone },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.branch.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
export const getBranchById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const branch = await prisma.branch.findUnique({ where: { id: Number(id) } });
        if(!branch) return res.status(404).json({ message: 'Branch not found' });
        res.json(branch);
    }catch(err){
    next(err);
    }
}
    