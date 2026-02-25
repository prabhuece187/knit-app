import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AuthHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function AuthHeader({
  icon: Icon,
  title,
  description,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: AuthHeaderProps) {
  return (
    <CardHeader className="text-center">
      {Icon && (
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Icon className={cn("w-6 h-6 text-blue-600", iconClassName)} />
        </div>
      )}
      <CardTitle className={cn("text-2xl font-bold", titleClassName)}>
        {title}
      </CardTitle>
      {description && (
        <CardDescription className={descriptionClassName}>
          {description}
        </CardDescription>
      )}
    </CardHeader>
  );
}
