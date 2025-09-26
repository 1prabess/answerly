"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransition } from "react";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LoginSchema, LoginType } from "@/lib/zodSchemas";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [isLoggingIn, startLoggingIn] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginType) => {
    startLoggingIn(async () => {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            toast.success("Logged in successfully!");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    });
  };

  const handleOAuth = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4 sm:px-6 ">
      <Card className="w-full  bg-background ">
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Form fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-400 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-400 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full  mt-2"
              >
                {isLoggingIn ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Login to your account"
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="after:border-border relative text-center text-sm  after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            {/* OAuth buttons */}
            <div className="flex  sm:items-center sm:justify-between gap-4">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="flex-1 flex items-center  justify-center gap-2 w-full sm:w-auto"
              >
                <FaGoogle className="size-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleOAuth("github")}
                className="flex-1  flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <FaGithub className="size-4" />
                GitHub
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm mt-4">
              Don't have an account? <Link href="/register">Register</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
