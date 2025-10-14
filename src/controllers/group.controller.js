import { prisma } from '../config/db.config.js';
import cloudinary from '../config/cloudinary.config.js';

// ✅ Get all groups
export const getGroups = async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { id: 'desc' }
    });
    res.json({ success: true, data: groups });
  } catch (err) {
    next(err);
  }
};

// ✅ Create group
export const createGroup = async (req, res, next) => {
  try {
    const { name, total_member } = req.body;
    let photo = '';

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: 'gym/groups' });
      photo = uploaded.secure_url;
    }

    const group = await prisma.group.create({
      data: {
        name,
        photo,
        total_member: total_member ? Number(total_member) : null,
      },
    });

    res.status(201).json({ success: true, data: group });
  } catch (err) {
    next(err);
  }
};

// ✅ Update group
export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, total_member } = req.body;
    let photo;

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: 'gym/groups' });
      photo = uploaded.secure_url;
    }

    const existing = await prisma.group.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: `Group with ID ${id} not found` });
    }

    const updated = await prisma.group.update({
      where: { id: Number(id) },
      data: {
        name: name || existing.name,
        total_member: total_member ? Number(total_member) : existing.total_member,
        photo: photo || existing.photo,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ✅ Delete group
export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.group.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ✅ Get single group by ID
export const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findUnique({ where: { id: Number(id) } });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, data: group });
  } catch (err) {
    next(err);
  }
};
