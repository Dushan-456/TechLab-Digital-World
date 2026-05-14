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
import CreateUserPage from "../pages/admin/CreateUserPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import CreateBusinessCardPage from "../pages/admin/CreateBusinessCardPage";
import ManageBusinessCardsPage from "../pages/admin/ManageBusinessCardsPage";
import CardViewer from "../templates/CardViewer";
import BusinessCardViewer from "../templates/BusinessCardViewer";

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
  {
    path: "/b/:cardId",
    element: <BusinessCardViewer />,
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
            path: "create/:type",
            element: <CreateInvitationPage />,
          },
          {
            path: "edit/:cardId",
            element: <CreateInvitationPage />,
          },
          {
            path: "invitations",
            element: <ManageInvitationsPage />,
          },
          {
            path: "business-cards/create",
            element: <CreateBusinessCardPage />,
          },
          {
            path: "business-cards/edit/:cardId",
            element: <CreateBusinessCardPage />,
          },
          {
            path: "business-cards",
            element: <ManageBusinessCardsPage />,
          },
          {
            path: "users",
            element: <ManageUsersPage />,
          },
          {
            path: "users/create",
            element: <CreateUserPage />,
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
