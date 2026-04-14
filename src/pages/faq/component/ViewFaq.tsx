import { CommonDrawer } from "@/components/common/CommonDrawer";
import CommonHeader from "@/components/common/CommonHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utility/utility";
import type { Faq } from "../schema-types/faq.schema";

interface ViewFaqProps {
  faq: Faq;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ViewFaq({ faq, open, setOpen }: ViewFaqProps) {
  const created = faq.createdAt ? new Date(faq.createdAt) : null;
  const updated = faq.updatedAt ? new Date(faq.updatedAt) : null;

  return (
    <CommonDrawer isOpen={open} onClose={() => setOpen(false)} side="right" size="md">
      <CommonHeader name="FAQ" />

      <Card className="border-muted/80 shadow-none">
        <CardHeader className="gap-3 pb-2 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {faq.category.toLowerCase()}
            </Badge>
            <Badge variant={faq.isPublic ? "default" : "outline"}>
              {faq.isPublic ? "Public" : "Private"}
            </Badge>
            <span className="text-muted-foreground text-sm tabular-nums">Order: {faq.sortOrder}</span>
          </div>
          <h2 className="text-lg font-semibold leading-snug">{faq.question}</h2>
          <p className="text-muted-foreground font-mono text-xs">/{faq.slug}</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
              Answer
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
          </div>

          {faq.metaTitle ? (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                Meta title
              </p>
              <p className="text-sm">{faq.metaTitle}</p>
            </div>
          ) : null}

          <Separator />

          <div className="text-muted-foreground grid gap-1 text-xs">
            <p>
              Created:{" "}
              {created && !Number.isNaN(created.getTime()) ? formatDate(created, "long") : "—"}
            </p>
            <p>
              Updated:{" "}
              {updated && !Number.isNaN(updated.getTime()) ? formatDate(updated, "long") : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </CommonDrawer>
  );
}
