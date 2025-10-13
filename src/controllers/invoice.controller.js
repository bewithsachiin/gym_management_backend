import { prisma } from '../config/db.config.js';

export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { member: true, payment: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (err) { next(err); }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(req.params.id) },
      include: { member: true, payment: true }
    });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { next(err); }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { memberId, amount, description, dueDate, status } = req.body;
    const invoice = await prisma.invoice.create({
      data: {
        memberId: Number(memberId),
        amount: parseFloat(amount),
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING'
      },
      include: { member: true }
    });
    res.json(invoice);
  } catch (err) { next(err); }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, description, dueDate, status } = req.body;
    const updated = await prisma.invoice.update({
      where: { id: Number(id) },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status
      },
      include: { member: true, payment: true }
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    await prisma.invoice.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
