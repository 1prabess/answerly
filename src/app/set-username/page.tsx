"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsernameSchema, UsernameType } from "@/lib/zod/authSchema";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

const SetUsername = () => {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameType>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: { username: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (username: string) =>
      axios.post("/api/update-username", { username }),
    onSuccess: () => {
      toast.success("Username set successfully!");
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to set username");
    },
  });

  useEffect(() => {
    if (!isSessionLoading && session?.user.username) {
      router.replace("/feed");
    }
  }, [session, isSessionLoading, router]);

  if (isSessionLoading || session?.user.username) {
    return null;
  }

  const onSubmit = (data: UsernameType) => {
    mutate(data.username);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        <Card className="w-full rounded-sm bg-background">
          <CardHeader>
            <CardTitle className="text-2xl">Set Your Username</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username (e.g., johndoe)"
                  {...register("username")}
                />
                {errors.username && (
                  <span className="text-red-400 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Save Username"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetUsername;
