import { prisma } from '../config/db.config.js';

export const getDutyRoster = async (req, res, next) => {
  try {
    const roster = await prisma.dutyRoster.findMany({
      include: {
        staff: {
          select: { name: true, first_name: true, last_name: true, staffRole: { select: { role_name: true } } }
        }
      }
    });
    // Format for frontend
    const formatted = roster.map(r => ({
      shift_id: r.shift_id,
      staff_id: r.staff_id,
      staff_name: r.staff.name || `${r.staff.first_name} ${r.staff.last_name}`,
      role: r.staff.staffRole?.role_name || '',
      date: r.date.toISOString().split('T')[0],
      shift_type: r.shift_type,
      start_time: r.start_time ? r.start_time.toISOString() : null,
      end_time: r.end_time ? r.end_time.toISOString() : null,
      breaks: r.breaks,
      status: r.status,
      approved_by: r.approved_by,
      approved_by_name: null, // TODO: fetch separately if needed
      approved_at: r.approved_at ? r.approved_at.toISOString() : null
    }));
    res.json(formatted);
  } catch (err) { next(err); }
};

export const createDutyShift = async (req, res, next) => {
  try {
    const { staff_id, date, shift_type, start_time, end_time, breaks, status } = req.body;
    const shift = await prisma.dutyRoster.create({
      data: {
        staff_id: Number(staff_id),
        date: new Date(date),
        shift_type,
        start_time: start_time ? new Date(start_time) : null,
        end_time: end_time ? new Date(end_time) : null,
        breaks,
        status: status || 'Scheduled'
      },
      include: {
        staff: {
          select: { name: true, first_name: true, last_name: true, staffRole: { select: { role_name: true } } }
        }
      }
    });
    const formatted = {
      shift_id: shift.shift_id,
      staff_id: shift.staff_id,
      staff_name: shift.staff.name || `${shift.staff.first_name} ${shift.staff.last_name}`,
      role: shift.staff.staffRole?.role_name || '',
      date: shift.date.toISOString().split('T')[0],
      shift_type: shift.shift_type,
      start_time: shift.start_time ? shift.start_time.toISOString() : null,
      end_time: shift.end_time ? shift.end_time.toISOString() : null,
      breaks: shift.breaks,
      status: shift.status,
      approved_by: shift.approved_by,
      approved_by_name: null,
      approved_at: null
    };
    res.json(formatted);
  } catch (err) { next(err); }
};

export const updateDutyShift = async (req, res, next) => {
  try {
    const { shift_id } = req.params;
    const { staff_id, date, shift_type, start_time, end_time, breaks, status } = req.body;
    const updated = await prisma.dutyRoster.update({
      where: { shift_id: Number(shift_id) },
      data: {
        staff_id: staff_id ? Number(staff_id) : undefined,
        date: date ? new Date(date) : undefined,
        shift_type,
        start_time: start_time ? new Date(start_time) : undefined,
        end_time: end_time ? new Date(end_time) : undefined,
        breaks,
        status
      },
      include: {
        staff: {
          select: { name: true, first_name: true, last_name: true, staffRole: { select: { role_name: true } } }
        }
      }
    });
    const formatted = {
      shift_id: updated.shift_id,
      staff_id: updated.staff_id,
      staff_name: updated.staff.name || `${updated.staff.first_name} ${updated.staff.last_name}`,
      role: updated.staff.staffRole?.role_name || '',
      date: updated.date.toISOString().split('T')[0],
      shift_type: updated.shift_type,
      start_time: updated.start_time ? updated.start_time.toISOString() : null,
      end_time: updated.end_time ? updated.end_time.toISOString() : null,
      breaks: updated.breaks,
      status: updated.status,
      approved_by: updated.approved_by,
      approved_by_name: updated.approved_by ? (await prisma.staff.findUnique({ where: { id: updated.approved_by }, select: { name: true } }))?.name : null,
      approved_at: updated.approved_at ? updated.approved_at.toISOString() : null
    };
    res.json(formatted);
  } catch (err) { next(err); }
};

export const deleteDutyShift = async (req, res, next) => {
  try {
    await prisma.dutyRoster.delete({ where: { shift_id: Number(req.params.shift_id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const approveDutyShift = async (req, res, next) => {
  try {
    const { shift_id } = req.params;
    const { approved_by } = req.body; // assuming approved_by is passed
    const updated = await prisma.dutyRoster.update({
      where: { shift_id: Number(shift_id) },
      data: {
        status: 'Approved',
        approved_by: Number(approved_by),
        approved_at: new Date()
      },
      include: {
        staff: {
          select: { name: true, first_name: true, last_name: true, staffRole: { select: { role_name: true } } }
        }
      }
    });
    const formatted = {
      shift_id: updated.shift_id,
      staff_id: updated.staff_id,
      staff_name: updated.staff.name || `${updated.staff.first_name} ${updated.staff.last_name}`,
      role: updated.staff.staffRole?.role_name || '',
      date: updated.date.toISOString().split('T')[0],
      shift_type: updated.shift_type,
      start_time: updated.start_time ? updated.start_time.toISOString() : null,
      end_time: updated.end_time ? updated.end_time.toISOString() : null,
      breaks: updated.breaks,
      status: updated.status,
      approved_by: updated.approved_by,
      approved_by_name: updated.approved_by ? (await prisma.staff.findUnique({ where: { id: updated.approved_by }, select: { name: true } }))?.name : null,
      approved_at: updated.approved_at ? updated.approved_at.toISOString() : null
    };
    res.json(formatted);
  } catch (err) { next(err); }
};

export const getDutyShiftById = async (req, res, next) => {
  try {
    const { shift_id } = req.params;
    const shift = await prisma.dutyRoster.findUnique({
      where: { shift_id: Number(shift_id) },
      include: {
        staff: {
          select: { name: true, first_name: true, last_name: true, staffRole: { select: { role_name: true } } }
        }
      }
    });
    if (!shift) return res.status(404).json({ message: 'Duty shift not found' });
    const formatted = {
      shift_id: shift.shift_id,
      staff_id: shift.staff_id,
      staff_name: shift.staff.name || `${shift.staff.first_name} ${shift.staff.last_name}`,
      role: shift.staff.staffRole?.role_name || '',
      date: shift.date.toISOString().split('T')[0],
      shift_type: shift.shift_type,
      start_time: shift.start_time ? shift.start_time.toISOString() : null,
      end_time: shift.end_time ? shift.end_time.toISOString() : null,
      breaks: shift.breaks,
      status: shift.status,
      approved_by: shift.approved_by,
      approved_by_name: shift.approved_by ? (await prisma.staff.findUnique({ where: { id: shift.approved_by }, select: { name: true } }))?.name : null,
      approved_at: shift.approved_at ? shift.approved_at.toISOString() : null
    };
    res.json(formatted);
  } catch (err) { next(err); }
};
