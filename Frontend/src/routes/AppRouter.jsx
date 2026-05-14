import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Error404Page from "../pages/Error404Page";
import Error403Page from "../pages/Error403Page";
import ProtectedRouter from "./ProtectedRouter";
import DashboardPage from "../pages/admin/DashboardPage";
import CreateInvitationPage from "../pages/admin/CreateInvitationPage";
import ManageInvitationsPage from "../pages/admin/ManageInvitationsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import CardViewer from "../templates/CardViewer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // --- Public Routes ---
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "*",
        element: <Error404Page />,
      },
    ],
  },
  // --- Login (no layout) ---
  {
    path: "/login",
    element: <LoginPage />,
  },
  // --- Card Viewer (public, no layout) ---
  {
    path: "/v/:cardId",
    element: <CardViewer />,
  },
  // --- Admin Protected Routes ---
  {
    element: <ProtectedRouter ProtectedRole="ADMIN" />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "create",
            element: <CreateInvitationPage />,
          },
          {
            path: "invitations",
            element: <ManageInvitationsPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
