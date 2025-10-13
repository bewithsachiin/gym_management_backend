import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.config.js';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ========== STAFF AUTH ==========
export const registerStaff = async (req, res, next) => {
  try {
    const { name, username, email, password, roleId, branchId } = req.body;
    const existing = await prisma.staff.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const staff = await prisma.staff.create({
      data: { name, username, email, password: hashed, roleId: Number(roleId), branchId: Number(branchId) || null },
      include: { staffRole: true, branch: true }
    });

    res.json({ success: true, staff });
  } catch (err) {
    next(err);
  }
};

export const loginStaff = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const staff = await prisma.staff.findUnique({ where: { username }, include: { staffRole: true } });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const match = await bcrypt.compare(password, staff.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: staff.id, username: staff.username, role: staff.staffRole?.role_name || staff.role || 'Unknown', type: 'staff', branchId: staff.branchId });
    res.json({ success: true, token, user: staff });
  } catch (err) {
    next(err);
  }
};

// ========== USER AUTH (Admin/SuperAdmin) ==========
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const staff = await prisma.staff.findUnique({ where: { username }, include: { staffRole: true } });
    if (!staff) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, staff.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: staff.id, username: staff.username, role: staff.staffRole?.role_name || staff.role || 'Unknown', type: 'user', branchId: staff.branchId });
    res.json({ success: true, token, user: staff });
  } catch (err) {
    next(err);
  }
};

// ========== MEMBER AUTH ==========
export const registerMember = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const member = await prisma.member.create({
      data: { name, email, password: hashed },
    });

    res.json({ success: true, member });
  } catch (err) {
    next(err);
  }
};

export const loginMember = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const member = await prisma.member.findUnique({ where: { email } });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const match = await bcrypt.compare(password, member.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: member.id, username: member.username, role: 'member', type: 'member' });
    res.json({ success: true, token, user: member });
  } catch (err) {
    next(err);
  }
};
