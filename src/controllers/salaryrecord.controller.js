import { prisma } from '../config/db.config.js';



// ✅ Generate a new Salary Record
export const createSalaryRecord = async (req, res) => {
  try {
    const {
      staff_id,
      role,
      compensation_type,
      hours_worked,
      hourly_rate,
      fixed_salary,
      commission_total,
      bonuses,
      deductions,
      period_start,
      period_end,
    } = req.body;

    // 🧮 Calculate hourly_total and net_pay
    const hourly_total = hours_worked && hourly_rate
      ? Number(hours_worked) * Number(hourly_rate)
      : 0;

    const bonusTotal = Array.isArray(bonuses)
      ? bonuses.reduce((acc, b) => acc + Number(b.amount || 0), 0)
      : 0;

    const deductionTotal = Array.isArray(deductions)
      ? deductions.reduce((acc, d) => acc + Number(d.amount || 0), 0)
      : 0;

    const net_pay =
      (Number(fixed_salary || 0) +
        Number(hourly_total || 0) +
        Number(commission_total || 0) +
        bonusTotal) -
      deductionTotal;

    // 🆔 Generate salary_id automatically
    const count = await prisma.salaryRecord.count();
    const salary_id = `SAL${String(count + 1).padStart(3, "0")}`;

    // 💾 Save record
    const record = await prisma.salaryRecord.create({
      data: {
        salary_id,
        staff_id,
        role,
        compensation_type,
        hours_worked,
        hourly_rate,
        hourly_total,
        fixed_salary,
        commission_total,
        bonuses,
        deductions,
        net_pay,
        period_start: new Date(period_start),
        period_end: new Date(period_end),
      },
    });

    res.status(201).json({ message: "Salary generated successfully", record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create salary record", error });
  }
};

// ✅ Get all salary records
export const getAllSalaryRecords = async (req, res) => {
  try {
    const records = await prisma.salaryRecord.findMany({
      include: { staff: true },
      orderBy: { created_at: "desc" },
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch salary records", error });
  }
};

// ✅ Get one record by ID
export const getSalaryRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.salaryRecord.findUnique({
      where: { id: Number(id) },
      include: { staff: true },
    });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch record", error });
  }
};

// ✅ Update salary record
export const updateSalaryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      role,
      compensation_type,
      hours_worked,
      hourly_rate,
      fixed_salary,
      commission_total,
      bonuses,
      deductions,
      period_start,
      period_end,
      status,
    } = req.body;

    // 🧮 Recalculate totals
    const hourly_total = hours_worked && hourly_rate
      ? Number(hours_worked) * Number(hourly_rate)
      : 0;

    const bonusTotal = Array.isArray(bonuses)
      ? bonuses.reduce((acc, b) => acc + Number(b.amount || 0), 0)
      : 0;

    const deductionTotal = Array.isArray(deductions)
      ? deductions.reduce((acc, d) => acc + Number(d.amount || 0), 0)
      : 0;

    const net_pay =
      (Number(fixed_salary || 0) +
        Number(hourly_total || 0) +
        Number(commission_total || 0) +
        bonusTotal) -
      deductionTotal;

    const updatedRecord = await prisma.salaryRecord.update({
      where: { id: Number(id) },
      data: {
        role,
        compensation_type,
        hours_worked,
        hourly_rate,
        hourly_total,
        fixed_salary,
        commission_total,
        bonuses,
        deductions,
        net_pay,
        status,
        period_start: period_start ? new Date(period_start) : undefined,
        period_end: period_end ? new Date(period_end) : undefined,
      },
    });

    res.json({ message: "Salary record updated successfully", updatedRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update record", error });
  }
};

// ✅ Delete salary record
export const deleteSalaryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.salaryRecord.delete({ where: { id: Number(id) } });
    res.json({ message: "Salary record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete record", error });
  }
};
