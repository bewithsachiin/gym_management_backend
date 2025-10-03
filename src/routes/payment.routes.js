import express from "express";
const router = express.Router();

import paymentController from "../controllers/payment.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, paymentController.getAllPayments);
router.get("/:id", authenticateToken, paymentController.getPaymentById);
router.post("/", authenticateToken, paymentController.createPayment);
router.put("/:id", authenticateToken, paymentController.updatePayment);
router.delete("/:id", authenticateToken, paymentController.deletePayment);

export default router;
