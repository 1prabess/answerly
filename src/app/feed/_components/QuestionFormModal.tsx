"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import {
  CreateQuestionSchema,
  CreateQuestionType,
} from "@/lib/zod/questionSchema";
import { uploadToCloudinary } from "@/lib/services/uploads";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { createQuestion } from "@/lib/services/questions";

const QuestionFormModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionType>({
    resolver: zodResolver(CreateQuestionSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      authorId: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateQuestionType) => createQuestion(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      reset();
      setPreview(null);
      onClose();
    },
  });

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  if (isSessionLoading) return <p>Loading...</p>;
  if (!session) return null;

  const userId = session?.user.id;

  const onSubmit = async (data: any) => {
    setIsUploadingImage(true);
    let imageUrl = "";

    if (data.image && data.image[0]) {
      imageUrl = await uploadToCloudinary(data.image[0]);
    }
    setIsUploadingImage(false);

    mutate({
      title: data.title,
      description: data.description,
      image: imageUrl,
      authorId: userId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ask an question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter question title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter question description"
              className={`h-46 ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md mt-2"
              />
            )}
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUploadingImage}>
              {isUploadingImage
                ? "Uploading Image..."
                : isPending
                ? "Creating..."
                : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionFormModal;
