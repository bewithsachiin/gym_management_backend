import { prisma } from '../config/db.config.js';
import cloudinary from '../config/cloudinary.config.js';

// Done All Completed
export const getGroups = async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany();
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { name, total_member  } = req.body;
    // console.log("req body : ", req.body);
    let photo = '';
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: 'gym/groups' });
      photo = uploaded.secure_url;
    }

    const group = await prisma.group.create({
      data: { 
        name, 
        photo, 
        total_member: Number(total_member )
      },
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { name, total_member } = req.body;
    let photo;

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gym/groups',
      });
      photo = uploaded.secure_url;
    }

    const existingGroup = await prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: `Group with ID ${id} not found`,
      });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: Number(id) },
      data: {
        name,
        total_member: Number(total_member),
        photo: photo || existingGroup.photo,
      },
    });

    res.json({ success: true, updatedGroup });
  } catch (err) {
    next(err);
  }
};


export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.group.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
export const getGroupById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const group = await prisma.group.findUnique({ where: { id: Number(id) } });
        if(!group) return res.status(404).json({ message: 'Group not found' });
        res.json(group);
    } catch(err){
        next(err);
    }
    }