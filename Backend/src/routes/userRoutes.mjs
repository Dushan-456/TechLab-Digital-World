import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.mjs";
import { RegisterValidator, loginValidator, forgotEmailValidator, resetPasswordValidate } from "../middleware/validationMethods.mjs";
import userControllers from "../controllers/userControllers.mjs";

const userRoutes = Router();

// --- PUBLIC ROUTES -------------------------------------------------------------------------------------------------------

userRoutes.post("/login", loginValidator(), userControllers.loginUser);
userRoutes.post("/logout", userControllers.logoutUser);
userRoutes.post("/forgot-password", forgotEmailValidator(), userControllers.forgotPassword);
userRoutes.post("/reset-password/:token", resetPasswordValidate(), userControllers.resetPassword);

// --- PROTECTED ROUTES (Require Authentication) -------------------------------------------------------------------------

userRoutes.get("/my-profile", authenticateToken, userControllers.myProfile);

// --- ADMIN-ONLY ROUTES (Require Authentication & Authorization) ----------------------------------------------------------

userRoutes.post("/register", authenticateToken, authorizeRole(["ADMIN"]), RegisterValidator(), userControllers.RegisterNewUser);
userRoutes.get("/", authenticateToken, authorizeRole(["ADMIN"]), userControllers.showAllUsers);
userRoutes.delete("/:id", authenticateToken, authorizeRole(["ADMIN"]), userControllers.deleteUserById);

export default userRoutes;
