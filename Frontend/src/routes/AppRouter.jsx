import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Error404Page from "../pages/Error404Page";
import Error403Page from "../pages/Error403Page";
import ProtectedRouter from "./ProtectedRouter";
import DashboardPage from "../pages/admin/DashboardPage";
import EditInvitationPage from "../pages/admin/EditInvitationPage";
import CreateWeddingPage from "../pages/admin/CreateWeddingPage";
import CreateBirthdayPage from "../pages/admin/CreateBirthdayPage";
import CreateEventPage from "../pages/admin/CreateEventPage";
import ManageInvitationsPage from "../pages/admin/ManageInvitationsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import CardSettingsPage from "../pages/admin/CardSettingsPage";
import CreateUserPage from "../pages/admin/CreateUserPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import CreateBusinessCardPage from "../pages/admin/CreateBusinessCardPage";
import ManageBusinessCardsPage from "../pages/admin/ManageBusinessCardsPage";
import RegisterPage from "../pages/RegisterPage";
import CustomerProfilePage from "../pages/CustomerProfilePage";
import OrderWizardPage from "../pages/OrderWizardPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
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
  // --- Auth Pages (no layout) ---
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // --- Customer Protected Routes (accessible to logged-in customers & admins) ---
  {
    element: <ProtectedRouter />,
    children: [
      {
        path: "/profile",
        element: <CustomerProfilePage />,
      },
      {
        path: "/order/create",
        element: <OrderWizardPage />,
      },
    ],
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
          // --- Order & Payment Approvals ---
          {
            path: "orders",
            element: <AdminOrdersPage />,
          },
          // --- Type-Specific Create Pages ---
          {
            path: "create",
            element: <Navigate to="/admin/create/wedding" replace />,
          },
          {
            path: "create/wedding",
            element: <CreateWeddingPage />,
          },
          {
            path: "create/birthday",
            element: <CreateBirthdayPage />,
          },
          {
            path: "create/event",
            element: <CreateEventPage />,
          },
          // --- Edit (uses combined page, auto-detects type) ---
          {
            path: "edit/:cardId",
            element: <EditInvitationPage />,
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
            path: "card-settings",
            element: <CardSettingsPage />,
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
