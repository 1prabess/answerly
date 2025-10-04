"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  createQuestion,
  fetchCategories,
  fetchTagsByCategory,
} from "@/lib/services/questions";
import Select, { MultiValue, SingleValue } from "react-select";
import { Tag } from "@/generated/prisma";

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryOption = { value: string; label: string };
type TagOption = { value: string; label: string };

const QuestionFormModal = ({ isOpen, onClose }: QuestionFormModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags", selectedCategory],
    queryFn: () => fetchTagsByCategory(selectedCategory as string),
    enabled: !!selectedCategory,
  });

  const tagOptions: TagOption[] = tags.map((tag: Tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateQuestionType) => createQuestion(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      reset();
      setPreview(null);
      setSelectedCategory(null);
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateQuestionType>({
    resolver: zodResolver(CreateQuestionSchema),
    defaultValues: {
      title: "",
      description: "",
      image: null,
      authorId: "",
      tagNames: [],
    },
  });

  if (isSessionLoading) return <p>Loading...</p>;
  if (!session) return null;

  const userId = session.user.id;

  const onSubmit = async (data: CreateQuestionType) => {
    setIsUploadingImage(true);
    let imageUrl = "";

    if (data.image) {
      imageUrl = await uploadToCloudinary(data.image);
    }

    setIsUploadingImage(false);

    mutate({
      title: data.title,
      description: data.description,
      image: imageUrl,
      authorId: userId,
      tagNames: data.tagNames,
    });
  };

  const categoryOptions: CategoryOption[] =
    categories?.map((cat: { id: string; name: string }) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ask a Question</DialogTitle>
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

          {/* Category Select */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              options={categoryOptions}
              value={
                categoryOptions.find((c) => c.value === selectedCategory) ||
                null
              }
              onChange={(selected: SingleValue<CategoryOption>) =>
                setSelectedCategory(selected ? selected.value : null)
              }
              placeholder="Select a category"
            />
          </div>

          {/* Tags Multi-select */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <Controller
              name="tagNames"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  options={tagOptions}
                  value={tagOptions.filter((option: TagOption) =>
                    field.value.includes(option.value)
                  )}
                  onChange={(selected: MultiValue<TagOption>) =>
                    field.onChange(selected.map((s) => s.value))
                  }
                  placeholder={
                    selectedCategory ? "Select tags" : "Select a category first"
                  }
                  isDisabled={!selectedCategory}
                />
              )}
            />
            {errors.tagNames && (
              <p className="text-sm text-red-500">{errors.tagNames.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setValue("image", file); // <-- important!
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
          <DialogFooter className="flex justify-between">
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
