import { prisma } from '../config/db.config.js';
import bcrypt from 'bcryptjs';

// GET ALL MEMBERS
export const getMembers = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      include: { branch: true, group: true },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET MEMBER BY ID
export const getMemberById = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: Number(req.params.id) },
      include: { branch: true, group: true },
    });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// CREATE MEMBER
export const createMember = async (req, res, next) => {
  try {
    const {
      member_code, first_name, middle_name, last_name, email, username, password, phone,
      address, city, state, date_of_birth, gender, status, membership_status,
      branch_id, group_id, weight, height, chest, waist, thigh, arms, fat_percent, plan
    } = req.body;

    const member_image = req.file ? req.file.path : null; // Cloudinary URL
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const member = await prisma.member.create({
      data: {
        member_code: member_code || `M${Math.floor(10000 + Math.random() * 90000)}`,
        first_name: first_name || 'Unknown',
        middle_name: middle_name || null,
        last_name: last_name || 'Unknown',
        email: email || null,
        username: username || null,
        password: hashedPassword,
        phone: phone || '0000000000',
        address: address || null,
        city: city || null,
        state: state || null,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender: gender || 'MALE',
        status: status || 'ACTIVE',
        membership_status: membership_status || 'ACTIVATED',
        member_image,
        branch_id: branch_id ? Number(branch_id) : null,
        group_id: group_id ? Number(group_id) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        thigh: thigh ? parseFloat(thigh) : null,
        arms: arms ? parseFloat(arms) : null,
        fat_percent: fat_percent ? parseFloat(fat_percent) : null,
        plan: plan || null
      },
      include: { branch: true, group: true }
    });

    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// UPDATE MEMBER
export const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      member_code, first_name, middle_name, last_name, email, username, phone,
      address, city, state, date_of_birth, gender, status, membership_status,
      branch_id, group_id, weight, height, chest, waist, thigh, arms, fat_percent, plan
    } = req.body;

    const member_image = req.file ? req.file.path : undefined;

    const updated = await prisma.member.update({
      where: { id: Number(id) },
      data: {
        member_code,
        first_name,
        middle_name,
        last_name,
        email,
        username,
        phone,
        address,
        city,
        state,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
        gender,
        status,
        membership_status,
        member_image,
        branch_id: branch_id ? Number(branch_id) : undefined,
        group_id: group_id ? Number(group_id) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        chest: chest ? parseFloat(chest) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        thigh: thigh ? parseFloat(thigh) : undefined,
        arms: arms ? parseFloat(arms) : undefined,
        fat_percent: fat_percent ? parseFloat(fat_percent) : undefined,
        plan
      },
      include: { branch: true, group: true }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE MEMBER
export const deleteMember = async (req, res, next) => {
  try {
    await prisma.member.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// CHANGE MEMBER PASSWORD
export const changeMemberPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ success: false, message: 'Password is required' });

    const hashedPassword = await bcrypt.hash(newPassword, 15);
    await prisma.member.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};
