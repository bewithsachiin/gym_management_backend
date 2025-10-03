import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username, role: user.role.name } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const member = await prisma.member.findUnique({
      where: { username },
    });

    if (!member || !member.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: member.id, username: member.username, type: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, user: { id: member.id, username: member.username, type: 'member' } });
  } catch (error) {
    console.error('Error logging in member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginStaff = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const staff = await prisma.staff.findUnique({
      where: { username },
    });

    if (!staff || !staff.password || !staff.loginAccess) {
      return res.status(401).json({ error: 'Invalid credentials or no login access' });
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: staff.id, username: staff.username, role: staff.role, type: 'staff' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, user: { id: staff.id, username: staff.username, role: staff.role, type: 'staff' } });
  } catch (error) {
    console.error('Error logging in staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  loginUser,
  loginMember,
  loginStaff,
};
