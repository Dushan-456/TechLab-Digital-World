import { Router } from "express";
import cardSettingControllers from "../controllers/cardSettingControllers.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";

const router = Router();

// Public: fetch settings (needed by templates without auth)
router.get("/", cardSettingControllers.getAll);

// Protected: CRUD operations
router.post("/seed", authenticateToken, cardSettingControllers.seed);
router.post("/", authenticateToken, cardSettingControllers.create);
router.patch("/:id", authenticateToken, cardSettingControllers.update);
router.delete("/:id", authenticateToken, cardSettingControllers.delete);

export default router;
