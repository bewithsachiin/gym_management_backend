import express from "express";
const router = express.Router();

import invoiceController from "../controllers/invoice.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, invoiceController.getAllInvoices);
router.get("/:id", authenticateToken, invoiceController.getInvoiceById);
router.post("/", authenticateToken, invoiceController.createInvoice);
router.put("/:id", authenticateToken, invoiceController.updateInvoice);
router.delete("/:id", authenticateToken, invoiceController.deleteInvoice);

export default router;
