import prisma from "../prisma/client.js";

// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        member: true,
        payments: true,
      },
    });
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
        payments: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new invoice
export const createInvoice = async (req, res) => {
  try {
    const { invoiceCode, amount, status, issuedDate, dueDate, paidDate, notes, memberId } = req.body;

    if (!invoiceCode || !amount || !issuedDate || !memberId) {
      return res.status(400).json({ error: "invoiceCode, amount, issuedDate, and memberId are required" });
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceCode,
        amount: parseFloat(amount),
        status,
        issuedDate: new Date(issuedDate),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        notes,
        memberId: Number(memberId),
      },
    });

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceCode, amount, status, issuedDate, dueDate, paidDate, notes, memberId } = req.body;

    const updatedInvoice = await prisma.invoice.update({
      where: { id: Number(id) },
      data: {
        invoiceCode,
        amount: amount ? parseFloat(amount) : undefined,
        status,
        issuedDate: issuedDate ? new Date(issuedDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        notes,
        memberId: memberId ? Number(memberId) : undefined,
      },
    });

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting invoice:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
