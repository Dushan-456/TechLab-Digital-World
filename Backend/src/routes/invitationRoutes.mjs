import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import invitationControllers from "../controllers/invitationControllers.mjs";

const invitationRoutes = Router();

// --- PUBLIC ROUTES ---
// Get an invitation by its unique cardId (used by the Card Viewer)
invitationRoutes.get("/:cardId", invitationControllers.getInvitation);

// --- PROTECTED ROUTES ---
// Create a new invitation (used by Admin Dashboard)
invitationRoutes.post("/", authenticateToken, invitationControllers.createInvitation);

export default invitationRoutes;
