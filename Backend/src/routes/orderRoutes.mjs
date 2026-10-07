import { Router } from "express";
import orderControllers from "../controllers/orderControllers.mjs";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.mjs";
import { paymentSlipUpload } from "../middleware/uploadMiddleware.mjs";

const orderRoutes = Router();

// --- CUSTOMER PROTECTED ROUTES -------------------------------------------------------------
orderRoutes.get("/my-orders", authenticateToken, orderControllers.getMyOrders);
orderRoutes.post("/:cardId/upload-slip", authenticateToken, paymentSlipUpload.single("slip"), orderControllers.uploadPaymentSlip);

// --- ADMIN ORDER MANAGEMENT ROUTES ---------------------------------------------------------
orderRoutes.get("/admin/all", authenticateToken, authorizeRole(["ADMIN"]), orderControllers.getAllOrdersForAdmin);
orderRoutes.patch("/admin/:cardId/approve", authenticateToken, authorizeRole(["ADMIN"]), orderControllers.approveOrder);
orderRoutes.patch("/admin/:cardId/reject", authenticateToken, authorizeRole(["ADMIN"]), orderControllers.rejectOrder);

export default orderRoutes;
