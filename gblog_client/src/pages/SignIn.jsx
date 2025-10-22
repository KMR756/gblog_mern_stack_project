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
import { Link } from "react-router"; // ✅ fixed import
import { AuthIndex, RouteIndex, RouteSignUp } from "@/helper/RoutesName";

// ✅ Improved schema with empty-field messages
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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="md:w-2/3 xl:w-1/2 px-10 py-5">
        <Link to={RouteIndex}>
          <div className="flex justify-center items-center">
            <img className="w-35" src={logo} alt="" />
          </div>
        </Link>
        <h1 className="text-center font-bold text-3xl md:text-6xl text-primary">
          LOG IN NOW
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Email Field */}
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
                  <FormMessage /> {/* ✅ shows validation messages */}
                </FormItem>
              )}
            />

            {/* Password Field */}
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

            {/* Submit Button + Link */}
            <div className="text-center">
              <Button className="w-1/2" type="submit">
                Sign In
              </Button>

              <div className="text-xs flex justify-center items-center py-3">
                <p>Don&apos;t have an account?</p>
                <Link
                  className="ml-2 underline text-blue-500"
                  to={`/${AuthIndex}/${RouteSignUp}`}
                >
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
