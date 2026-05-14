import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import Error404Page from "../pages/Error404Page";
import Dashboard from "../pages/Dashboard";
import CardViewer from "../pages/CardViewer";
import AuthPage from "../pages/AuthPage";
import ProtectedRouter from "./ProtectedRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "v/:cardId",
        element: <CardViewer />,
      },
      {
        path: "login",
        element: <AuthPage />,
      },
      {
        path: "register",
        element: <AuthPage />,
      },
      {
        element: <ProtectedRouter />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "*",
        element: <Error404Page />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
