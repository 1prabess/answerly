import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
};

export const ImageUpload = ({ control }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Label>Upload Image</Label>
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                field.onChange(file);
              }
            }}
          />
        )}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 h-40 w-full rounded-md object-cover"
        />
      )}
    </div>
  );
};
