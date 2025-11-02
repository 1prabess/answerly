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
import { Button } from "@/components/ui/button";
import {
  CreateQuestionSchema,
  CreateQuestionType,
} from "@/lib/zod/questionSchema";
import { useCreateQuestion } from "@/features/questions/hooks";
import { authClient } from "@/lib/auth-client";
import { uploadToCloudinary } from "@/lib/services/uploads";

import { QuestionTitleInput } from "@/features/questions/components/QuestionTitleInput";
import { QuestionDescriptionInput } from "@/features/questions/components/QuestionDescriptionInput";
import { CategorySelect } from "@/components/ui/category-select";
import { TagsSelect } from "@/components/ui/tags-select";
import { ImageUpload } from "@/components/ui/image-upload";

type QuestionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QuestionFormModal = ({ isOpen, onClose }: QuestionFormModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const { mutate, isPending } = useCreateQuestion();

  const {
    control,
    handleSubmit,
    reset,
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

  const onSubmit = async (data: CreateQuestionType) => {
    setIsUploadingImage(true);
    let imageUrl = data.image ? await uploadToCloudinary(data.image) : "";
    setIsUploadingImage(false);

    mutate(
      { ...data, authorId: session.user.id, image: imageUrl }, // ← NO communityName
      {
        onSuccess: () => {
          reset();
          setSelectedCategory(null);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ask a Question</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <QuestionTitleInput control={control} error={errors.title?.message} />
          <QuestionDescriptionInput
            control={control}
            error={errors.description?.message}
          />
          <CategorySelect
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <TagsSelect
            control={control}
            categoryId={selectedCategory}
            error={errors.tagNames?.message}
          />
          <ImageUpload control={control} />

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUploadingImage}>
              {isUploadingImage
                ? "Uploading..."
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
