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
    const { role_name, role_description, permissionsJson, status } = req.body;
    const newRole = await prisma.role.create({
      data: { role_name, role_description, permissionsJson, status: status || 'ACTIVE' },
    });
    res.json(newRole);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_name, role_description, permissions_json } = req.body;
    const updated = await prisma.role.update({
      where: { id: Number(id) },
      data: { role_name, role_description, permissions_json },
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

export const getRoleByName = async (req, res, next) => {
    try{
        const { role_name } = req.params;
        const role = await prisma.role.findUnique({ where: { role_name } });
        if(!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    }catch(err){
        next(err);
    }
}

export const changeRoleStatus = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.role.update({
            where: { id: Number(id) },
            data: { status }
        });
        res.json(updated);
    }catch(err){
        next(err);
    }
}

export const getActiveRoles = async (req, res, next) => {
    try{
        const roles = await prisma.role.findMany({ where: { status: 'ACTIVE' } });
        res.json(roles);
    } catch(err){
        next(err);
    }
}