import { prisma } from '../config/db.config.js';

export const getMemberAttendance = async (req, res, next) => {
  try {
    const records = await prisma.memberAttendance.findMany({ include: { member: true } });
    res.json(records);
  } catch (err) { next(err); }
};

export const recordMemberCheckin = async (req, res, next) => {
  try {
    const { memberId, checkInTime } = req.body;
    const record = await prisma.memberAttendance.create({
      data: { memberId: Number(memberId), checkInTime: new Date(checkInTime || Date.now()) },
    });
    res.json(record);
  } catch (err) { next(err); }
};

export const recordMemberCheckout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkOutTime } = req.body;
    const updated = await prisma.memberAttendance.update({
      where: { id: Number(id) },
      data: { checkOutTime: new Date(checkOutTime || Date.now()) },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

// Staff attendance
export const getStaffAttendance = async (req, res, next) => {
  try {
    const records = await prisma.staffAttendance.findMany({ include: { staff: true } });
    res.json(records);
  } catch (err) { next(err); }
};

export const recordStaffCheckin = async (req, res, next) => {
  try {
    const { staffId, checkInTime } = req.body;
    const record = await prisma.staffAttendance.create({
      data: { staffId: Number(staffId), checkInTime: new Date(checkInTime || Date.now()) },
    });
    res.json(record);
  } catch (err) { next(err); }
};

export const recordStaffCheckout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkOutTime } = req.body;
    const updated = await prisma.staffAttendance.update({
      where: { id: Number(id) },
      data: { checkOutTime: new Date(checkOutTime || Date.now()) },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const getMemberAttendanceById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const record = await prisma.memberAttendance.findUnique({ where: { id: Number(id) }, include: { member: true } });
        if(!record) return res.status(404).json({ message: 'Attendance record not found' });
        res.json(record);
    }catch(err){
        next(err);
    }
}

export const getStaffAttendanceById = async (req, res, next) => {
  try{
      const { id } = req.params;
      const record = await prisma.staffAttendance.findUnique({ where: { id: Number(id) }, include: { staff: true } });
      if(!record) return res.status(404).json({ message: 'Attendance record not found' });
      res.json(record);
  }catch(err){
    next(err);
  }
}

export const generateQR = async (req, res, next) => {
  try {
    const { memberId } = req.body;
    const member = await prisma.member.findUnique({ where: { id: Number(memberId) } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    const nonce = Math.random().toString(36).substring(2, 15);
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 60 * 1000); // 60 seconds
    const qrData = {
      purpose: 'gym_checkin',
      memberId: member.id,
      memberName: member.name,
      issuedAt: issuedAt.toISOString(),
      nonce,
      expiresAt: expiresAt.toISOString()
    };
    res.json(qrData);
  } catch (err) { next(err); }
};

export const checkinWithQR = async (req, res, next) => {
  try {
    const { qrData } = req.body;
    const { memberId, nonce, expiresAt } = qrData;
    if (new Date() > new Date(expiresAt)) return res.status(400).json({ message: 'QR code expired' });
    // Check if nonce is used, but for simplicity, assume not
    const attendance = await prisma.memberAttendance.create({
      data: {
        memberId: Number(memberId),
        checkInTime: new Date(),
      },
      include: { member: true }
    });
    res.json(attendance);
  } catch (err) { next(err); }
};
