import {
  AuthIndex,
  RouteIndex,
  RouteSignIn,
  RouteSignUp,
} from "@/helper/RoutesName";
import AuthLayout from "@/layouts/AuthLayout";
import Root from "@/layouts/Root";
import EditProfile from "@/pages/EditProfile";
import Home from "@/pages/Home";

import SignIn from "@/pages/SignIn";
import Signup from "@/pages/Signup";
import UserProfile from "@/pages/UserProfile";
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
      {
        path: "user-profile",
        Component: UserProfile,
      },
      {
        path:"edit-profile",
        Component:EditProfile
      }
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
