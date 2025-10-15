"use client";

import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCommunitySchema,
  CreateCommunityType,
} from "@/lib/zod/communitySchema";
import { useCreateCommunity } from "../hooks";
import { uploadToCloudinary } from "@/lib/services/uploads";

type CreateCommunityModalProps = {
  open: boolean;
  onClose: () => void;
};

const CreateCommunityModal = ({ open, onClose }: CreateCommunityModalProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateCommunityType>({
    resolver: zodResolver(CreateCommunitySchema),
    defaultValues: { name: "", description: "", avatar: null, banner: null },
  });

  const { mutate: createCommunity, isPending } = useCreateCommunity();

  const onSubmit = async (data: CreateCommunityType) => {
    let avatarUrl = "";
    let bannerUrl = "";

    if (data.avatar) {
      setIsUploadingAvatar(true);
      avatarUrl = await uploadToCloudinary(data.avatar);
      setIsUploadingAvatar(false);
    }

    if (data.banner) {
      setIsUploadingBanner(true);
      bannerUrl = await uploadToCloudinary(data.banner);
      setIsUploadingBanner(false);
    }

    createCommunity(
      {
        name: data.name,
        description: data.description,
        avatar: avatarUrl || undefined,
        banner: bannerUrl || undefined,
      },
      {
        onSuccess: () => {
          reset();
          setAvatarPreview(null);
          setBannerPreview(null);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Community Name *
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g. react-developers"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your community..."
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-sm font-medium">
              Avatar Image (optional)
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarPreview(URL.createObjectURL(file));
                  setValue("avatar", file);
                }
              }}
              className={errors.avatar ? "border-red-500" : ""}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2 h-24 w-24 rounded-full object-cover"
              />
            )}
            {errors.avatar && (
              <p className="text-xs text-red-600">{errors.avatar.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner" className="text-sm font-medium">
              Banner Image (optional)
            </Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setBannerPreview(URL.createObjectURL(file));
                  setValue("banner", file);
                }
              }}
              className={errors.banner ? "border-red-500" : ""}
            />
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="mt-2 h-40 w-full rounded-md object-cover"
              />
            )}
            {errors.banner && (
              <p className="text-xs text-red-600">{errors.banner.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isPending || isUploadingAvatar || isUploadingBanner}
              type="submit"
            >
              {isUploadingAvatar || isUploadingBanner
                ? "Uploading Images..."
                : isPending
                  ? "Creating..."
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityModal;
