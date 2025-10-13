import { prisma } from '../config/db.config.js';

export const getSalaries = async (req, res, next) => {
  try {
    const salaries = await prisma.salary.findMany({ include: { staff: true } });
    res.json(salaries);
  } catch (err) { next(err); }
};

export const recordSalary = async (req, res, next) => {
  try {
    const { staffId, amount, month, paidAt, status } = req.body;
    const salary = await prisma.salary.create({
      data: {
        staffId: Number(staffId),
        amount: Number(amount),
        month,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        status: status || 'paid',
      },
    });
    res.json(salary);
  } catch (err) { next(err); }
};

export const updateSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, status } = req.body;
    const updated = await prisma.salary.update({
      where: { id: Number(id) },
      data: { amount: Number(amount), status },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteSalary = async (req, res, next) => {
  try {
    await prisma.salary.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
export const getSalaryById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const salary = await prisma.salary.findUnique({ where: { id: Number(id) }, include: { staff: true } });
        if(!salary) return res.status(404).json({ message: 'Salary record not found' });
        res.json(salary);
    }catch(err){
        next(err);
    }
}