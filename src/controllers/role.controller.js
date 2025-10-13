import { prisma } from '../config/db.config.js';

export const getRoles = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { name, description, permissionsJson, status } = req.body;
    const newRole = await prisma.role.create({
      data: { name, description, permissionsJson, status: status || 'ACTIVE' },
    });
    res.json(newRole);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, permissionsJson } = req.body;
    const updated = await prisma.role.update({
      where: { id: Number(id) },
      data: { name, description, permissionsJson },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.role.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getRoleById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const role = await prisma.role.findUnique({ where: { id: Number(id) } });
        if(!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    }catch(err){
        next(err);
    } 
}
