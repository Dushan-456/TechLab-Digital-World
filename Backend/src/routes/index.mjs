import { Router } from "express";
import userRoutes from "./userRoutes.mjs";
import invitationRoutes from "./invitationRoutes.mjs";
import invitationControllers from "../controllers/invitationControllers.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import businessCardRoutes from "./businessCardRoutes.mjs";
import { upload } from "../middleware/uploadMiddleware.mjs";

// Create the main root router
const rootRouter = Router();

// Health check endpoint (to test if API is running)
rootRouter.get("/", (req, res) => res.sendStatus(200));

// Dashboard stats route (before mounting sub-routers)
rootRouter.get("/invitations/stats/overview", authenticateToken, invitationControllers.getDashboardStats);

// Image upload route
rootRouter.post("/upload-image", authenticateToken, upload.single("image"), (req, res) => {
   if (!req.file) return res.status(400).json({ message: "No file uploaded" });
   const imageUrl = `/uploads/profile_pics/${req.file.filename}`;
   res.status(200).json({ success: true, imageUrl });
});

// Mount feature routers
rootRouter.use("/users", userRoutes);
rootRouter.use("/invitations", invitationRoutes);
rootRouter.use("/business-cards", businessCardRoutes);

// Handle undefined routes (404 Not Found)
rootRouter.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default rootRouter;
