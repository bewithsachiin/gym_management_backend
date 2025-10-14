import { prisma } from "../config/db.config.js";

// ✅ Get all salary records
export const getAllSalaryRecords = async (req, res, next) => {
  try {
    const records = await prisma.salaryRecord.findMany({
      include: { staff: true },
      orderBy: { created_at: "desc" },
    });
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// ✅ Get a single salary record by ID
export const getSalaryRecordById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const record = await prisma.salaryRecord.findUnique({
      where: { id: parseInt(id) },
      include: { staff: true },
    });
    if (!record) return res.status(404).json({ success: false, message: "Salary record not found" });
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// ✅ Create a new salary record
export const createSalaryRecord = async (req, res, next) => {
  const {
    staff_id,
    status,
    commission_total,
    fixed_salary,
    hourly_rate,
    hours_worked,
    net_pay,
    bonus_label,
    bonus_amount,
    deduction_label,
    deduction_amount,
    period_start,
    period_end,
  } = req.body;

  try {
    const newRecord = await prisma.salaryRecord.create({
      data: {
        staff_id,
        status,
        commission_total,
        fixed_salary,
        hourly_rate,
        hours_worked,
        net_pay,
        bonus_label,
        bonus_amount,
        deduction_label,
        deduction_amount,
        period_start: new Date(period_start),
        period_end: new Date(period_end),
      },
    });
    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    next(error);
  }
};

// ✅ Update a salary record
export const updateSalaryRecord = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedRecord = await prisma.salaryRecord.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ success: true, data: updatedRecord });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete a salary record
export const deleteSalaryRecord = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.salaryRecord.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: "Salary record deleted successfully" });
  } catch (error) {
    next(error);
  }
};
