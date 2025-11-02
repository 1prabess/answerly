import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  error?: string;
};

export const QuestionDescriptionInput = ({ control, error }: Props) => (
  <div className="space-y-2">
    <Label>Description</Label>
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <Textarea
          {...field}
          placeholder="Enter question description"
          className={`h-46 ${error ? "border-red-500" : ""}`}
        />
      )}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
