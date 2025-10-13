import { prisma } from '../config/db.config.js';
import bcrypt from 'bcryptjs';

export const getStaff = async (req, res, next) => {
  try {
    const staff = await prisma.staff.findMany({ include: { role: true, branch: true } });
    res.json(staff);
  } catch (err) { next(err); }
};

export const getStaffById = async (req, res, next) => {
  try {
    const staff = await prisma.staff.findUnique({ where: { id: Number(req.params.id) } });
    res.json(staff);
  } catch (err) { next(err); }
};

export const createStaff = async (req, res, next) => {
  try {
    const {
      staff_id, first_name, last_name, name, gender, dob, email, phone,
      role_label, status, join_date, exit_date, salary_type, fixed_salary, hourly_rate, commission_rate_percent,
      login_enabled, username, password, branch_id, role_id
    } = req.body;
    const profile_photo = req.file ? req.file.path : null;
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const fullName = name || `${first_name} ${last_name}`;
    const staff = await prisma.staff.create({
      data: {
        staff_id: staff_id || `S${Math.floor(10000 + Math.random() * 90000)}`,
        first_name, last_name, name: fullName, gender, dob: dob ? new Date(dob) : null,
        email, phone, profile_photo, role_label, status: status || 'ACTIVE',
        join_date: join_date ? new Date(join_date) : new Date(),
        exit_date: exit_date ? new Date(exit_date) : null,
        salary_type, fixed_salary: fixed_salary ? parseFloat(fixed_salary) : null,
        hourly_rate: hourly_rate ? parseFloat(hourly_rate) : null,
        commission_rate_percent: commission_rate_percent ? parseFloat(commission_rate_percent) : null,
        login_enabled: login_enabled || false, username, password: hashed,
        branch_id: branch_id ? Number(branch_id) : null, role_id: role_id ? Number(role_id) : null
      },
      include: { role: true, branch: true }
    });
    res.json(staff);
  } catch (err) { next(err); }
};

export const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      staff_id, first_name, last_name, name, gender, dob, email, phone,
      role_label, status, join_date, exit_date, salary_type, fixed_salary, hourly_rate, commission_rate_percent,
      login_enabled, username, branch_id, role_id
    } = req.body;
    const profile_photo = req.file ? req.file.path : undefined;
    const fullName = name || `${first_name} ${last_name}`;
    const staff = await prisma.staff.update({
      where: { id: Number(id) },
      data: {
        staff_id, first_name, last_name, name: fullName, gender, dob: dob ? new Date(dob) : undefined,
        email, phone, profile_photo, role_label, status,
        join_date: join_date ? new Date(join_date) : undefined,
        exit_date: exit_date ? new Date(exit_date) : undefined,
        salary_type, fixed_salary: fixed_salary ? parseFloat(fixed_salary) : undefined,
        hourly_rate: hourly_rate ? parseFloat(hourly_rate) : undefined,
        commission_rate_percent: commission_rate_percent ? parseFloat(commission_rate_percent) : undefined,
        login_enabled, username,
        branch_id: branch_id ? Number(branch_id) : undefined, role_id: role_id ? Number(role_id) : undefined
      },
      include: { role: true, branch: true }
    });
    res.json(staff);
  } catch (err) { next(err); }
};

export const deleteStaff = async (req, res, next) => {
  try {
    await prisma.staff.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
export const changeStaffPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        const hashed = await bcrypt.hash(newPassword, 15);
        await prisma.staff.update({
            where: { id: Number(id) },
            data: { password: hashed },
        });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

