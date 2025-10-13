import { prisma } from '../config/db.config.js';
import bcrypt from 'bcryptjs';

export const getMembers = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany({ include: { branch: true } });
    res.json(members);
  } catch (err) { next(err); }
};

export const getMemberById = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({ where: { id: Number(req.params.id) } });
    res.json(member);
  } catch (err) { next(err); }
};

export const createMember = async (req, res, next) => {
  try {
    const {
      member_code, first_name, middle_name, last_name, email, username, password, phone, address, city, state,
      date_of_birth, gender, status, membership_status, branch_id, group_id,
      weight, height, chest, waist, thigh, arms, fat_percent, plan, mobile
    } = req.body;
    const member_image = req.file ? req.file.path : null;
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const member = await prisma.member.create({
      data: {
        member_code: member_code || `M${Math.floor(10000 + Math.random() * 90000)}`,
        first_name, middle_name, last_name, email, username, password: hashed, phone: phone || mobile, address, city, state,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender, status: status || 'ACTIVE', membership_status: membership_status || 'ACTIVATED', member_image,
        branch_id: branch_id ? Number(branch_id) : null, group_id: group_id ? Number(group_id) : null,
        weight: weight ? parseFloat(weight) : null, height: height ? parseFloat(height) : null,
        chest: chest ? parseFloat(chest) : null, waist: waist ? parseFloat(waist) : null,
        thigh: thigh ? parseFloat(thigh) : null, arms: arms ? parseFloat(arms) : null,
        fat_percent: fat_percent ? parseFloat(fat_percent) : null,
        plan
      },
      include: { branch: true, group: true }
    });
    res.json(member);
  } catch (err) { next(err); }
};

export const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      member_code, first_name, middle_name, last_name, email, username, phone, address, city, state,
      date_of_birth, gender, status, membership_status, branch_id, group_id,
      weight, height, chest, waist, thigh, arms, fat_percent, plan
    } = req.body;
    const member_image = req.file ? req.file.path : undefined;
    const updated = await prisma.member.update({
      where: { id: Number(id) },
      data: {
        member_code, first_name, middle_name, last_name, email, username, phone, address, city, state,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
        gender, status, membership_status, member_image,
        branch_id: branch_id ? Number(branch_id) : undefined, group_id: group_id ? Number(group_id) : undefined,
        weight: weight ? parseFloat(weight) : undefined, height: height ? parseFloat(height) : undefined,
        chest: chest ? parseFloat(chest) : undefined, waist: waist ? parseFloat(waist) : undefined,
        thigh: thigh ? parseFloat(thigh) : undefined, arms: arms ? parseFloat(arms) : undefined,
        fat_percent: fat_percent ? parseFloat(fat_percent) : undefined,
        plan
      },
      include: { branch: true, group: true }
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteMember = async (req, res, next) => {
  try {
    await prisma.member.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
export const changeMemberPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        const hashed = await bcrypt.hash(newPassword, 15);
        await prisma.member.update({
            where: { id: Number(id) },
            data: { password: hashed },
        });
        res.json({ success: true });
    } 
    catch (err) {
         next(err); 
}
}