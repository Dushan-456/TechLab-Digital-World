import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import { loginValidator, RegisterValidator } from "../middleware/validationMethods.mjs";
import userControllers from "../controllers/userControllers.mjs";

const userRoutes = Router();

// --- PUBLIC ROUTES ---
userRoutes.post("/register", RegisterValidator(), userControllers.RegisterNewUser);
userRoutes.post("/login", loginValidator(), userControllers.loginUser);
userRoutes.post("/logout", userControllers.logoutUser);

// --- PROTECTED ROUTES ---
userRoutes.get("/my-profile", authenticateToken, userControllers.myProfile);

export default userRoutes;
