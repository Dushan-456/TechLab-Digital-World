import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.mjs";
import { createInvitationValidator } from "../middleware/validationMethods.mjs";
import invitationControllers from "../controllers/invitationControllers.mjs";

const invitationRoutes = Router();

// --- PUBLIC ROUTES (for card viewer) ---------------------------------------------------------------------------------

invitationRoutes.get("/:cardId", invitationControllers.getInvitationByCardId);

// --- PROTECTED ROUTES (Require Authentication) -----------------------------------------------------------------------

invitationRoutes.post("/", authenticateToken, createInvitationValidator(), invitationControllers.createInvitation);
invitationRoutes.get("/", authenticateToken, invitationControllers.getAllInvitations);
invitationRoutes.patch("/:cardId", authenticateToken, invitationControllers.updateInvitation);

// --- ADMIN-ONLY ROUTES ------------------------------------------------------------------------------------------------

invitationRoutes.delete("/:cardId", authenticateToken, authorizeRole(["ADMIN"]), invitationControllers.deleteInvitation);

export default invitationRoutes;
