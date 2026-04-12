import { CommonDrawer } from '@/components/common/CommonDrawer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate, statusBadgeVariant, statusLabel, initialsFromName } from '@/utility/utility';
import { cn } from '@/lib/utils';
import { CheckCircle2, Quote, Star } from 'lucide-react';
import type { Review } from '../schema-types/review.schema';
import CommonHeader from '@/components/common/CommonHeader';
import { useApproveReviewMutation, useRejectReviewMutation, useToggleTestimonialMutation } from '../api/ReviewsApi';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMemo, useState } from 'react';

interface ViewReviewProps {
    review: Review;
    open: boolean;
    setOpen: (open: boolean) => void;
}

function StarRating({ value, className }: { value: number | null | undefined; className?: string }) {
    const n = value == null ? 0 : Math.min(5, Math.max(0, Math.round(value)));
    return (
        <div className={cn('flex items-center gap-0.5', className)} aria-label={`${n} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={cn(
                        'size-4 shrink-0',
                        i < n ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/40',
                    )}
                />
            ))}
        </div>
    );
}

type ReviewActionConfirm = 'approve' | 'reject' | 'toggle';

export default function ViewReview({ review, open, setOpen }: ViewReviewProps) {
    const reviewerName = review.visitor?.name?.trim() || 'Anonymous';
    const created = review.createdAt ? new Date(review.createdAt) : null;

    const [confirmAction, setConfirmAction] = useState<ReviewActionConfirm | null>(null);

    const [approveReview] = useApproveReviewMutation();
    const [rejectReview] = useRejectReviewMutation();
    const [toggleTestimonial] = useToggleTestimonialMutation();

    const confirmCopy = useMemo(() => {
        return {
            approve: {
                title: 'Approve this review?',
                description:
                    'This review will be marked as approved. Make sure the content meets your moderation guidelines.',
                confirmLabel: 'Approve',
                destructive: false,
            },
            reject: {
                title: 'Reject this review?',
                description:
                    'The review will be marked as rejected. This action can affect what visitors see, depending on your settings.',
                confirmLabel: 'Reject',
                destructive: true,
            },
            toggle: {
                title: review.isTestimonial
                    ? 'Remove from featured testimonials?'
                    : 'Feature this review as a testimonial?',
                description: review.isTestimonial
                    ? 'It will no longer be highlighted as a featured testimonial where you show them.'
                    : 'It will be highlighted as a featured testimonial where you show them.',
                confirmLabel: review.isTestimonial ? 'Remove feature' : 'Feature review',
                destructive: false,
            },
        } as const;
    }, [review.isTestimonial]);

    const canApprove =
        review.status === 'PENDING' || review.status === 'REJECTED';
    const canReject =
        review.status === 'PENDING' || review.status === 'APPROVED';

    const executeConfirmedAction = async () => {
        if (confirmAction == null) return;
        try {
            if (confirmAction === 'approve') {
                await approveReview(review.id).unwrap();
                toast.success('Review approved successfully.');
                setOpen(false);
            } else if (confirmAction === 'reject') {
                await rejectReview(review.id).unwrap();
                toast.success('Review rejected successfully.');
                setOpen(false);
            } else {
                await toggleTestimonial(review.id).unwrap();
                toast.success('Testimonial updated successfully.');
                setOpen(false);
            }
            setConfirmAction(null);
        } catch (error: unknown) {
            console.error(error);
            toast.error((error as { data?: { message?: string } })?.data?.message ?? 'Failed to perform action. Please try again.');
        }
    };

    return (
        <CommonDrawer
            isOpen={open}
            onClose={() => setOpen(false)}
            side="right"
            size="md"
        >

            <CommonHeader name="Review" />

            <Card className="border-muted/80 shadow-none">
                <CardHeader className="gap-4 pb-2 pt-4">
                    <div className="flex flex-wrap items-start gap-4">
                        <Avatar className="size-12 border bg-muted/50">
                            <AvatarFallback className="text-sm font-medium">
                                {initialsFromName(review.visitor?.name ?? null)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold leading-tight">{reviewerName}</span>
                                {review.isVerified && (
                                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="size-3.5 shrink-0" />
                                        Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {created && !Number.isNaN(created.getTime())
                                    ? formatDate(created, 'long')
                                    : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <StarRating value={review.rating} />
                        {review.rating != null && (
                            <span className="text-muted-foreground text-sm">
                                <span className="text-foreground font-medium">{review.rating}</span>
                                {' / 5'}
                            </span>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 pb-6">
                    {(review.title != null && review.title !== '') || (review.message != null && review.message !== '') ? (
                        <div className="space-y-3">
                            {review.title != null && review.title !== '' ? (
                                <h2 className="text-lg font-semibold leading-snug tracking-tight">
                                    {review.title}
                                </h2>
                            ) : (
                                <p className="text-muted-foreground text-sm italic">No title</p>
                            )}
                            <div className="relative rounded-lg border border-dashed bg-muted/30 px-4 py-3">
                                <Quote className="text-muted-foreground/50 absolute left-2 top-2 size-5 -scale-x-100" />
                                <p className="relative z-[1] pl-6 text-[15px] leading-relaxed text-foreground/90">
                                    {review.message != null && review.message !== ''
                                        ? review.message
                                        : 'No written feedback.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">No review text provided.</p>
                    )}


                    <Separator />

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={statusBadgeVariant(review.status)} className="capitalize">
                            {statusLabel(review.status)}
                        </Badge>
                        {review.isTestimonial && (
                            <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
                                Featured testimonial
                            </Badge>
                        )}
                    </div>

                    {review.professional && (
                        <p className="text-muted-foreground text-sm">
                            <span className="text-foreground/80 font-medium">For </span>
                            {review.professional.name}
                            <span className="text-muted-foreground"> · @{review.professional.slug}</span>
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {canApprove && (
                            <Button type="button" variant="outline" onClick={() => setConfirmAction('approve')}>
                                Approve
                            </Button>
                        )}
                        {canReject && (
                            <Button type="button" variant="outline" onClick={() => setConfirmAction('reject')}>
                                Reject
                            </Button>
                        )}
                        {review.status === 'APPROVED' && (
                            <Button
                                type="button"
                                variant={review.isTestimonial ? 'default' : 'outline'}
                                onClick={() => setConfirmAction('toggle')}
                            >
                                {review.isTestimonial ? 'Unfeature testimonial' : 'Feature as testimonial'}
                            </Button>
                        )}
                    </div>

                </CardContent>
            </Card>

            {/* AlertDialog for confirming the review */}
            <AlertDialog
                open={confirmAction !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) setConfirmAction(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction != null ? confirmCopy[confirmAction].title : ''}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction != null ? confirmCopy[confirmAction].description : ''}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            type="button"
                            className={
                                confirmAction === 'reject'
                                    ? buttonVariants({ variant: 'destructive' })
                                    : undefined
                            }
                            onClick={() => void executeConfirmedAction()}
                        >
                            {confirmAction != null ? confirmCopy[confirmAction].confirmLabel : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CommonDrawer>
    );
}
