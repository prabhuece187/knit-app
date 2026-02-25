import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <Card className={cn("shadow-lg", className)}>
      <CardContent className="space-y-6 p-6">{children}</CardContent>
    </Card>
  );
}
