import { Router } from "express";
import userRoutes from "./userRoutes.mjs";
import invitationRoutes from "./invitationRoutes.mjs";

const rootRouter = Router();

rootRouter.get("/", (req, res) => res.sendStatus(200));

rootRouter.use("/users", userRoutes);
rootRouter.use("/invitations", invitationRoutes);

rootRouter.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default rootRouter;
