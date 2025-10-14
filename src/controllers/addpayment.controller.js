import { prisma } from "../config/db.config.js";

// ✅ Add new payment
export const addPayment = async (req, res) => {
  try {
    const {
      member_id,
      amount,
      method,
      status,
      invoice_no,
      receipt_url,
      payment_description,
      invoice_id,
    } = req.body;

    // Basic validation
    if (!member_id || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: "member_id, amount, and method are required",
      });
    }

    // Check if member exists
    const memberExists = await prisma.member.findUnique({
      where: { id: Number(member_id) },
    });
    if (!memberExists) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    const payment = await prisma.payment.create({
      data: {
        member_id: Number(member_id),
        amount: parseFloat(amount),
        method,
        status: status || "PENDING",
        invoice_no: invoice_no || null,
        receipt_url: receipt_url || null,
        payment_description: payment_description || null,
        invoice_id: invoice_id ? Number(invoice_id) : null,
      },
      include: { member: true, invoice: true },
    });

    res
      .status(201)
      .json({ success: true, message: "Payment added successfully", payment });
  } catch (error) {
    console.error("Add Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { member: true, invoice: true },
      orderBy: { created_at: "desc" },
    });
    res.json({ success: true, payments });
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
      include: { member: true, invoice: true },
    });

    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Get Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update payment (NEW)
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      amount,
      method,
      status,
      invoice_no,
      receipt_url,
      payment_description,
      invoice_id,
    } = req.body;

    const payment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        method,
        status,
        invoice_no,
        receipt_url,
        payment_description,
        invoice_id: invoice_id ? Number(invoice_id) : undefined,
      },
      include: { member: true, invoice: true },
    });

    res.json({ success: true, message: "Payment updated successfully", payment });
  } catch (error) {
    console.error("Update Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Delete Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
