import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo-white.png";
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
import { RouteIndex, RouteSignIn } from "@/helper/RoutesName";
import { Link, useNavigate } from "react-router"; // ✅ fixed import

import { ShowToast } from "@/helper/ShowToast";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Enter your name.")
      .min(3, "Name must be at least 3 characters long."),
    email: z
      .string()
      .min(1, "Enter your email address.")
      .email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/[0-9]/, "Password must include at least one number.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must include at least one special character."
      ),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const Signup = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    // console.log(values);

    try {
      const response = await fetch(`http://localhost:8000/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      // const data = await response.json();
      // console.log(response.data);
      const data = await response.json();

      console.log("Full response:", response);
      console.log("Parsed data:", data);
      if (!response.ok) {
        // console.log(data.message);
        ShowToast("error", data.message || "Registration failed");
        return;
      }
      ShowToast("success", data.message || "Registered successfully");
      navigate(RouteSignIn);
    } catch (error) {
      ShowToast("error", "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="md:w-2/3 xl:w-1/2 px-10 py-5">
        <Link to={RouteIndex}>
          <div className="flex justify-center items-center">
            <img className="w-35" src={logo} alt="" />
          </div>
        </Link>
        <h1 className="text-center font-bold text-xl md:text-4xl text-primary">
          REGISTRATION NOW
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password:</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <Button className="w-1/2" type="submit">
                Sign Up
              </Button>
              <div className="text-xs flex justify-center items-center py-3">
                <p>Already have an account?</p>
                <Link className="ml-2 underline text-blue-500" to={RouteSignIn}>
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
