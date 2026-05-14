import { Router } from "express";
import userRoutes from "./userRoutes.mjs";
import invitationRoutes from "./invitationRoutes.mjs";
import invitationControllers from "../controllers/invitationControllers.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";

// Create the main root router
const rootRouter = Router();

// Health check endpoint (to test if API is running)
rootRouter.get("/", (req, res) => res.sendStatus(200));

// Dashboard stats route (before mounting sub-routers)
rootRouter.get("/invitations/stats/overview", authenticateToken, invitationControllers.getDashboardStats);

// Mount feature routers
rootRouter.use("/users", userRoutes);
rootRouter.use("/invitations", invitationRoutes);

// Handle undefined routes (404 Not Found)
rootRouter.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default rootRouter;
