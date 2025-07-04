import { useState, type Dispatch,type SetStateAction } from "react";
import { Button } from "../ui/button";
import AddState from "@/pages/state/component/AddState";
import AddCustomer from "@/pages/customer/component/AddCustomer";
import AddItem from "@/pages/items/component/AddItem";

// Define the valid labels
type LabelType = "State" | "Customer" | "Item";

// Props allow any string
type DynamicAddProps = {
  label: string;
};

// Component map with strong typing
const componentMap: Record<LabelType, React.ComponentType<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }>> = {
  State: AddState,
  Customer: AddCustomer,
  Item: AddItem,
};

// Type guard to ensure label is one of the valid options
const isValidLabel = (label: string): label is LabelType => {
  return ["State", "Customer", "Item"].includes(label);
};

export default function DynamicAdd({ label }: DynamicAddProps) {
  const [open, setOpen] = useState(false);

  // Validate label before rendering the mapped component
  if (!isValidLabel(label)) {
    return (
      <div className="text-red-500 m-2">
        Invalid label: <strong>{label}</strong>
      </div>
    );
  }

  const SelectedComponent = componentMap[label];

  return (
    <>
      <Button
        variant="secondary"
        className="m-2"
        onClick={() => setOpen(true)}
      >
        + Add New {label}
      </Button>

      {SelectedComponent && (
        <SelectedComponent open={open} setOpen={setOpen} />
      )}
    </>
  );
}
