import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { editReviewSchema } from "@/pages/reviews/schema-types/review.schema";
import type { Review } from "@/pages/reviews/schema-types/review.schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateReviewMutation } from "@/pages/reviews/api/ReviewsApi";
import { useEffect } from "react";
import CommonHeader from "@/components/common/CommonHeader";
import { toast } from "sonner";

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export default function EditReview({
    open,
    setOpen,
    review,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    review: Review;
}) {
    const [updateReview] = useUpdateReviewMutation();

    const form = useForm<z.infer<typeof editReviewSchema>>({
        resolver: zodResolver(editReviewSchema),
        defaultValues: {
            title: "",
            message: "",
            rating: 3,
        },
    });

    useEffect(() => {
        if (open && review) {
            form.reset({
                title: review.title ?? "",
                message: review.message ?? "",
                rating: review.rating != null ? review.rating : 3,
            });
        }
    }, [open, review, form]);

    function onSubmit(values: z.infer<typeof editReviewSchema>) {
        updateReview({
            id: review.id,
            title: values.title.trim() === "" ? null : values.title.trim(),
            message: values.message.trim() === "" ? null : values.message.trim(),
            rating: values.rating,
        })
            .unwrap()
            .then(() => {
                toast.success("Review updated successfully.");
                form.reset();
                setOpen(false);
            })
            .catch((error: { data?: { message?: string } }) => {
                toast.error(error?.data?.message ?? "Failed to update review.");
            });
    }

    function handleCancel() {
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <CommonHeader name="Edit Review" />
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className="grid grid-cols-12 px-2 py-2">
                    <div className="col-span-12">
                        <Form {...form}>
                            <form
                                id="edit-review-form"
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-6 gap-2">
                                    <div className="col-span-6">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Review title"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <FormField
                                            control={form.control}
                                            name="rating"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rating*</FormLabel>
                                                    <Select
                                                        onValueChange={(v) =>
                                                            field.onChange(Number(v))
                                                        }
                                                        value={String(field.value)}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select rating" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {RATING_OPTIONS.map((n) => (
                                                                <SelectItem
                                                                    key={n}
                                                                    value={String(n)}
                                                                >
                                                                    {n} / 5
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Review message"
                                                            className="min-h-[120px] resize-y"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-12 flex justify-end">
                                        <Button
                                            type="button"
                                            className="m-1"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="m-1">
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
