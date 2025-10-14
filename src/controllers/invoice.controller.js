// controllers/invoice.controller.js
import { prisma } from "../config/db.config.js";

// ---------------- GET ALL INVOICES ----------------
export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        member: true,
        payments: true,
        invoiceitem: true
      },
      orderBy: { created_at: "desc" },
    });
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

// ---------------- GET INVOICE BY ID ----------------
export const getInvoiceById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        member: true,
        payments: true,
        invoiceitem: true
      },
    });

    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// ---------------- CREATE INVOICE ----------------
export const createInvoice = async (req, res, next) => {
  try {
    const {
      branch_id,
      member_id,
      invoice_number,
      status,
      email,
      customer_name,
      phone,
      invoice_date,
      due_date,
      notes,
      discount,
      subtotal,
      tax_amount,
      total_amount,
      items // array of invoice items
    } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        branch_id: branch_id ? Number(branch_id) : null,
        member_id: Number(member_id),
        invoice_number,
        status: status || "UNPAID",
        email,
        customer_name,
        phone,
        invoice_date: invoice_date ? new Date(invoice_date) : new Date(),
        due_date: due_date ? new Date(due_date) : null,
        notes,
        discount: discount ? parseFloat(discount) : null,
        subtotal: parseFloat(subtotal),
        tax_amount: parseFloat(tax_amount),
        total_amount: parseFloat(total_amount),
        invoiceitem: {
          create: items?.map(item => ({
            description: item.description,
            quantity: Number(item.quantity),
            price: parseFloat(item.price),
            tax_percent: parseFloat(item.tax_percent),
            line_total: parseFloat(item.line_total),
          })) || []
        }
      },
      include: {
        member: true,
        payments: true,
        invoiceitem: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    });
  } catch (err) {
    console.error("Invoice create error:", err);
    next(err);
  }
};

// ---------------- UPDATE INVOICE ----------------
export const updateInvoice = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const {
      status,
      email,
      customer_name,
      phone,
      due_date,
      notes,
      discount,
      subtotal,
      tax_amount,
      total_amount,
      items // array of invoice items
    } = req.body;

    // Delete old invoice items and create new ones
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status,
        email,
        customer_name,
        phone,
        due_date: due_date ? new Date(due_date) : undefined,
        notes,
        discount: discount ? parseFloat(discount) : undefined,
        subtotal: subtotal ? parseFloat(subtotal) : undefined,
        tax_amount: tax_amount ? parseFloat(tax_amount) : undefined,
        total_amount: total_amount ? parseFloat(total_amount) : undefined,
        invoiceitem: items
          ? {
              deleteMany: {},
              create: items.map(item => ({
                description: item.description,
                quantity: Number(item.quantity),
                price: parseFloat(item.price),
                tax_percent: parseFloat(item.tax_percent),
                line_total: parseFloat(item.line_total),
              })),
            }
          : undefined,
      },
      include: {
        member: true,
        payments: true,
        invoiceitem: true
      }
    });

    res.json({
      success: true,
      message: "Invoice updated successfully",
      data: updated
    });
  } catch (err) {
    console.error("Invoice update error:", err);
    next(err);
  }
};

// ---------------- DELETE INVOICE ----------------
export const deleteInvoice = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.invoice.delete({ where: { id } });
    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (err) {
    console.error("Invoice delete error:", err);
    next(err);
  }
};
