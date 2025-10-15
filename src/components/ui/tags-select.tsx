import Select from "react-select";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useTagOptions, useTags } from "@/features/tags/hooks";

type Props = {
  control: any;
  categoryId: string | null;
  error?: string;
};

export const TagsSelect = ({ control, categoryId, error }: Props) => {
  const { data: tags } = useTags(categoryId);
  const tagOptions = useTagOptions(tags || []);

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <Controller
        name="tagNames"
        control={control}
        render={({ field }) => (
          <Select
            isMulti
            options={tagOptions}
            value={tagOptions.filter((option: any) =>
              field.value.includes(option.value),
            )}
            onChange={(selected: any) =>
              field.onChange(selected.map((s: any) => s.value))
            }
            placeholder={categoryId ? "Select tags" : "Select a category first"}
            isDisabled={!categoryId}
          />
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
