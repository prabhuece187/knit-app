import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileCardProps = {
  headname: string;
  icon: React.ReactNode;
  content: React.ReactNode; // Allow JSX
};

export default function ProfileCard({
  headname,
  icon,
  content,
}: ProfileCardProps) {
  return (
    <Card className="rounded-md border py-0 gap-2">
      <CardHeader className="flex flex-row items-center gap-0 border-b p-1 bg-muted/50 px-2 [.border-b]:pb-2">
        <div className="text-xs h-5 w-5 text-muted-foreground flex items-center px-1">
          {icon}
        </div>
        <CardTitle className="text-xs text-base font-medium text-muted-foreground text-[12px]">
          {headname}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-2 text-xs">{content}</CardContent>
    </Card>
  );
}
