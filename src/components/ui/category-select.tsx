import Select from "react-select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/features/categories/hooks";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const CategorySelect = ({ value, onChange }: Props) => {
  const { data: categories } = useCategories();

  const options =
    categories?.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <Select
        options={options}
        value={options.find((c: any) => c.value === value) || null}
        onChange={(selected: any) => onChange(selected?.value || null)}
        placeholder="Select a category"
      />
    </div>
  );
};
