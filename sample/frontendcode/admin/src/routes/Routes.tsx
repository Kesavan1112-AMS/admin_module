import { createBrowserRouter, Outlet } from "react-router-dom";
import { ProtectRoutes } from "./ProtectedRoutes";
import { Provider } from "react-redux";
import { store } from "../stores/Auth";
import { lazy, Suspense } from "react";
import { PublicRoute } from "./PublicRoutes";
import Unauthorized from "../pages/Unauthorized";
import Header from "../layout/Header";
import LoaderComponent from "../components/sharedComponents/LoaderComponent";
import AnimatedRoute from "../components/sharedComponents/AnimatedRoute";

const LoginPage = lazy(() => import("../pages/loginPage/LoginPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const LandingScreen = lazy(
  () => import("../pages/landingScreenPage/LandingScreen")
);

export const router = createBrowserRouter([
  {
    element: (
      <Provider store={store}>
        <Suspense fallback={<LoaderComponent />}>
          <Outlet />
        </Suspense>
      </Provider>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/login",
        element: <PublicRoute element={<LoginPage />} />,
      },
      {
        element: <ProtectRoutes element={<Outlet />} />,
        children: [
          {
            path: "/",
            element: (
              <AnimatedRoute routeKey="/">
                <Header />
                <LandingScreen />
              </AnimatedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
