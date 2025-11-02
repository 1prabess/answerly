import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  error?: string;
};

export const QuestionTitleInput = ({ control, error }: Props) => (
  <div className="space-y-2">
    <Label>Title</Label>
    <Controller
      name="title"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Enter question title"
          className={error ? "border-red-500" : ""}
        />
      )}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
