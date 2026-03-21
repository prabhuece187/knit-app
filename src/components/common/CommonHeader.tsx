import { ArrowLeft } from "lucide-react";

interface CommonHeaderProps {
  name: string;
  trigger?: React.ReactNode;
  showBackButton?: boolean;
}

export default function CommonHeader({
  name,
  trigger,
  showBackButton = false,
}: CommonHeaderProps) {
  return (
    <>
      <div className="h-12 w-full rounded-lg mb-2">
        <div className="flex w-full items-center justify-between bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 p-2">
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              {showBackButton && <ArrowLeft className="w-5 h-5" />}
              {name}
            </h1>
          </div>
          <div className="flex items-center gap-2 p-2">{trigger}</div>
        </div>
      </div>
    </>
  );
}
