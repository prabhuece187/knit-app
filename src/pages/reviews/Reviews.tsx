
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDataTable } from "@/hooks/useDataTable";
import type { Review, ReviewQuery } from "./schema-types/review.schema";
import { toast } from "sonner";
import { useDeleteReviewMutation, useGetReviewsQuery } from "./api/ReviewsApi";
import { getReviewColumns } from "./constant/review-config";
import ViewReview from "./component/ViewReview";
import ReviewFilter from "./component/ReviewFilter";
import EditReview from "./component/EditReview";
import CommonConfirmDialogue from "@/components/common/CommonConfirmDialogue";
import { blurActiveElement } from "@/utility/utility";

export default function Reviews() {
    // Data table state management (pagination, search, filters)
    const {
        pagination,
        searchTerm,
        filters,
        handlePageChange,
        handleLimitChange,
        handleSortChange,
        handleSearchChange,
        handleFilterChange,
        queryParams,
        updatePaginationMeta,
    } = useDataTable<ReviewQuery, Review>({
        searchField: "search",
    });

    // Dialog state
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    /** Ref avoids losing the id when Radix fires onOpenChange(false) before Confirm onClick. */
    const pendingDeleteIdRef = useRef<number | null>(null);

    const {
        data: response,
        isLoading: reviewLoading,
        isError,
    } = useGetReviewsQuery(queryParams);

    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

    const handleEdit = useCallback((review: Review) => {
        setSelectedReview(review);
        setOpen(true);
    }, []);

    const handleView = useCallback((review: Review) => {
        blurActiveElement();
        setSelectedReview(review);
        setOpenView(true);
    }, []);

    const handleDelete = useCallback((id: number) => {
        pendingDeleteIdRef.current = id;
        setDeleteConfirmOpen(true);
    }, []);

    const handleCancelDelete = useCallback(() => {
        pendingDeleteIdRef.current = null;
        setDeleteConfirmOpen(false);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        const id = pendingDeleteIdRef.current;
        if (id == null) return;
        deleteReview(id)
            .unwrap()
            .then((response) => {
                toast.success(response.message || "Review deleted successfully");
                pendingDeleteIdRef.current = null;
                setDeleteConfirmOpen(false);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to delete review");
            });
    }, [deleteReview]);

    // Update pagination metadata when response changes
    useEffect(() => {
        if (response?.meta) {
            updatePaginationMeta(response.meta);
        }
    }, [response?.meta, updatePaginationMeta]);

    const reviewData = response?.data ?? [];

    const columns = useMemo(
        () =>
            getReviewColumns({
                onEdit: handleEdit,
                onView: handleView,
                onDelete: handleDelete,
                currentSortBy: pagination.sortBy,
                currentSortOrder: pagination.sortOrder,
                onSortChange: handleSortChange,
            }),
        [
            handleEdit,
            handleView,
            handleDelete,
            pagination.sortBy,
            pagination.sortOrder,
            handleSortChange,
        ]
    );

    const filterComponents = useMemo(
        () => (
            <ReviewFilter filters={filters} onFilterChange={handleFilterChange} />
        ),
        [filters, handleFilterChange]
    );

    return (
        <>
            <EnhancedDataTableCard
                name="Reviews"
                columns={columns}
                data={reviewData}
                meta={response?.meta}
                loading={reviewLoading}
                isError={isError}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onSortChange={handleSortChange}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search reviews by message..."
                searchValue={searchTerm}
                filterComponents={filterComponents}
                module="review"
            />

            {selectedReview && (
                <EditReview review={selectedReview} open={open} setOpen={setOpen} />
            )}

            {selectedReview && (
                <ViewReview review={selectedReview} open={openView} setOpen={setOpenView} />
            )}

            <CommonConfirmDialogue
                open={deleteConfirmOpen}
                setOpen={setDeleteConfirmOpen}
                title="Delete this review?"
                description="This removes the review permanently. You cannot undo this action."
                variant="destructive"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
            />
        </>
    );
}
