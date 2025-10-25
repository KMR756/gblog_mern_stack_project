import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "@/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { RouteIndex, RouteSignUp } from "@/helper/RoutesName";
import { ShowToast } from "@/helper/ShowToast";
import GoogleLogin from "@/components/GoogleLogin";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import api from "@/helper/api";

// ✅ Validation Schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address.")
    .email("Invalid email address."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .min(8, "Password must be at least 8 characters long."),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      // ✅ Send user credentials to backend
      const { data } = await api.post("/auth/login", values, {
        withCredentials: true, // if your backend uses cookies
      });
      const response = data.data;
      // console.log(response);
      // ✅ Check if login successful
      if (!data?.data?.user || !data?.data?.token) {
        ShowToast(
          "warning",
          data?.message || "Login failed. Please try again."
        );
        return;
      }

      // ✅ Save token and user in Redux
      dispatch(
        setUser({
          user: data.data.user,
          token: data.data.token,
        })
      );

      // ✅ Optional: store access token in localStorage if needed
      localStorage.setItem("token", data.data.token);

      ShowToast("success", data.message || "Login successful");
      navigate(RouteIndex);
    } catch (error) {
      console.error("Login error:", error);
      ShowToast(
        "error",
        error?.response?.data?.message || "Something went wrong during login"
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="px-10 py-5">
        <Link to={RouteIndex}>
          <div className="flex justify-center items-center">
            <img className="w-35" src={logo} alt="Logo" />
          </div>
        </Link>

        <h1 className="text-center font-bold text-3xl md:text-6xl text-primary">
          LOG IN NOW
        </h1>

        <GoogleLogin />

        <div className="border-1 my-5 flex justify-center items-center w-1/2 mx-auto relative">
          <span className="absolute font-bold bg-white px-2">OR</span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <Button className="w-1/2" type="submit">
                Sign In
              </Button>

              <div className="text-xs flex justify-center items-center py-3">
                <p>Don&apos;t have an account?</p>
                <Link className="ml-2 underline text-blue-500" to={RouteSignUp}>
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
