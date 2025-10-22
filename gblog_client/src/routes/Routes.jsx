import {
  AuthIndex,
  RouteIndex,
  RouteSignIn,
  RouteSignUp,
} from "@/helper/RoutesName";
import AuthLayout from "@/layouts/AuthLayout";
import Root from "@/layouts/Root";
import Home from "@/pages/Home";

import SignIn from "@/pages/SignIn";
import Signup from "@/pages/Signup";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
  {
    path: RouteIndex,
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: AuthIndex,
    Component: AuthLayout,
    children: [
      {
        path: RouteSignIn,
        Component: SignIn,
      },
      {
        path: RouteSignUp,
        Component: Signup,
      },
    ],
  },
]);
