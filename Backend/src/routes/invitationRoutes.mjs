import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.mjs";
import { createInvitationValidator } from "../middleware/validationMethods.mjs";
import { invitationUpload } from "../middleware/uploadMiddleware.mjs";
import invitationControllers from "../controllers/invitationControllers.mjs";

const invitationRoutes = Router();

// --- PUBLIC ROUTES (for card viewer) ---------------------------------------------------------------------------------

invitationRoutes.get("/:cardId", invitationControllers.getInvitationByCardId);

// --- PROTECTED ROUTES (Require Authentication) -----------------------------------------------------------------------

const uploadFields = invitationUpload.fields([
   { name: "coverImage", maxCount: 1 },
   { name: "galleryImages", maxCount: 10 },
]);

invitationRoutes.post("/", authenticateToken, uploadFields, createInvitationValidator(), invitationControllers.createInvitation);
invitationRoutes.get("/", authenticateToken, invitationControllers.getAllInvitations);
invitationRoutes.patch("/:cardId", authenticateToken, uploadFields, invitationControllers.updateInvitation);

// --- ADMIN-ONLY ROUTES ------------------------------------------------------------------------------------------------

invitationRoutes.delete("/:cardId", authenticateToken, authorizeRole(["ADMIN"]), invitationControllers.deleteInvitation);

export default invitationRoutes;
