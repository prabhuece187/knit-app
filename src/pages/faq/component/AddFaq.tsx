import CommonHeader from "@/components/common/CommonHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateFaqMutation } from "../api/FaqApi";
import {
  createFaqSchema,
  type CreateFaqFormValues,
  type CreateFaqPayload,
} from "../schema-types/faq.schema";

export default function AddFaq({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [createFaq] = useCreateFaqMutation();

  const form = useForm<CreateFaqFormValues>({
    resolver: zodResolver(createFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "VISITOR",
      isPublic: true,
      sortOrder: 0,
      slug: "",
      metaTitle: "",
    },
  });

  function buildPayload(values: CreateFaqFormValues): CreateFaqPayload {
    const meta = values.metaTitle?.trim();
    return {
      question: values.question.trim(),
      answer: values.answer.trim(),
      category: values.category,
      isPublic: values.isPublic,
      sortOrder: values.sortOrder,
      slug: values.slug.trim(),
      ...(meta ? { metaTitle: meta } : {}),
    };
  }

  function onSubmit(values: CreateFaqFormValues) {
    createFaq(buildPayload(values))
      .unwrap()
      .then((response) => {
        toast.success(response.message ?? "FAQ created successfully.");
        form.reset();
        setOpen(false);
      })
      .catch((error: { data?: { message?: string } }) => {
        toast.error(error?.data?.message ?? "Failed to create FAQ.");
      });
  }

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Add FAQ" />
          </DialogTitle>
          <DialogDescription>
            Create a new FAQ entry. Slug must be lowercase with hyphens only.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-faq-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Question" className="min-h-[80px] resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Answer" className="min-h-[120px] resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VISITOR">Visitor</SelectItem>
                        <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort order*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. how-to-register" className="font-mono text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta title (SEO)</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional meta title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Public</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Create FAQ</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
