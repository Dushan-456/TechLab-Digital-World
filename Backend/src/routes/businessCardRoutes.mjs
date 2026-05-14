import express from "express";
import businessCardControllers from "../controllers/businessCardControllers.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import { createBusinessCardValidator } from "../middleware/validationMethods.mjs";

const router = express.Router();

router.post("/", authenticateToken, createBusinessCardValidator(), businessCardControllers.createCard);
router.get("/", authenticateToken, businessCardControllers.getAllCards);
router.get("/:cardId", businessCardControllers.getCardByCardId);
router.patch("/:cardId", authenticateToken, businessCardControllers.updateCard);
router.delete("/:cardId", authenticateToken, businessCardControllers.deleteCard);

export default router;
