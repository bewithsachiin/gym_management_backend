import prisma from "../prisma/client.js";

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        member: true,
        invoice: true,
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
        invoice: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new payment
export const createPayment = async (req, res) => {
  try {
    const { paymentCode, amount, method, status, paidDate, notes, memberId, invoiceId } = req.body;

    if (!paymentCode || !amount || !method || !paidDate || !memberId) {
      return res.status(400).json({ error: "paymentCode, amount, method, paidDate, and memberId are required" });
    }

    const newPayment = await prisma.payment.create({
      data: {
        paymentCode,
        amount: parseFloat(amount),
        method,
        status,
        paidDate: new Date(paidDate),
        notes,
        memberId: Number(memberId),
        invoiceId: invoiceId ? Number(invoiceId) : undefined,
      },
    });

    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentCode, amount, method, status, paidDate, notes, memberId, invoiceId } = req.body;

    const updatedPayment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        paymentCode,
        amount: amount ? parseFloat(amount) : undefined,
        method,
        status,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        notes,
        memberId: memberId ? Number(memberId) : undefined,
        invoiceId: invoiceId ? Number(invoiceId) : undefined,
      },
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.payment.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting payment:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
