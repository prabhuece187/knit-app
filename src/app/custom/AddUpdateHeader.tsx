import { Button } from "../../components/ui/button";


export default function AddUpdateHeader({
  name,
  onSave,
  onCancel,
}: {
  name: string;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="h-12 w-full rounded-lg px-4">
      <div className="flex w-full items-center justify-between bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 p-2">
          <h1>{name}</h1>
        </div>
        <div className="flex items-center gap-2 p-2">
          <Button type="button" onClick={onCancel} variant="outline" size="sm">
            Cancel
          </Button>
          <Button type="button" onClick={onSave} variant="outline" size="sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
