import { ArrowLeft } from "lucide-react";

export default function CommonHeader({
  name,
  trigger,
}: {
  name: string;
  trigger?: React.ReactNode;
}) {
  return (
    <>
      <div className="h-12 w-full rounded-lg mb-2">
        <div className="flex w-full items-center justify-between bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 p-2">
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              <ArrowLeft className="w-5 h-5" />
              {name}
            </h1>
          </div>
          <div className="flex items-center gap-2 p-2">{trigger}</div>
        </div>
      </div>
    </>
  );
}
