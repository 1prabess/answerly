"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { RegisterSchema, RegisterType } from "@/lib/zod/authSchema";
import { Loader } from "lucide-react";

const RegisterForm = () => {
  const [isRegistering, startRegistering] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = (data: RegisterType) => {
    startRegistering(async () => {
      await authClient.signUp.email(
        {
          name: data.username,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            toast.success("Account created successfully!");
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
    <div className="flex flex-col gap-4 w-full  mx-auto  ">
      <Card className="w-full rounded-sm bg-background gap-2 sm:gap-4">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Form fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                />
                {errors.username && (
                  <span className="text-red-400 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>

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
                disabled={isRegistering}
                className="w-full mt-2"
              >
                {isRegistering ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Create account"
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
            <div className="flex  sm:items-center sm:justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleOAuth("google")}
                className="flex-1 flex items-center justify-center gap-2 w-full sm:w-auto"
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
            <div className="text-center text-sm ">
              Already have an account? <Link href="/login">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs mt-2">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};

export default RegisterForm;
