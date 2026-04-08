
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";

import { useDataTable } from "@/hooks/useDataTable";
import type { Review, ReviewQuery } from "./schema-types/review.schema";
import { toast } from "sonner";
import { useDeleteReviewMutation, useGetReviewsQuery } from "./api/ReviewsApi";
import { getReviewColumns } from "./constant/review-config";

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
        searchField: "title",
    });

    // Dialog state
    const [open, setOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    // API calls
    const {
        data: response,
        isLoading: reviewLoading,
        isError,
    } = useGetReviewsQuery(queryParams);

    const [deleteReview] = useDeleteReviewMutation();

    // Memoize stable handlers to prevent column recreation
    const handleEdit = useCallback((review: Review) => {
        setSelectedReview(review);
        setOpen(true);
    }, []);

    const handleAdd = useCallback(() => {
        setSelectedReview(null);
        setOpen(true);
    }, []);

    const handleDelete = useCallback(
        (id: number) => {
            deleteReview(id)
                .unwrap()
                .then((response) => {
                    toast.success(response.message || "Review deleted successfully");
                })
                .catch((error) => {
                    toast.error(error.data?.message || "Failed to delete review");
                });
        },
        [deleteReview]
    );

    // Update pagination metadata when response changes
    useEffect(() => {
        if (response?.meta) {
            updatePaginationMeta(response.meta);
        }
    }, [response?.meta, updatePaginationMeta]);

    const reviewData = response?.data ?? [];

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(
        () =>
            getReviewColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
                currentSortBy: pagination.sortBy,
                currentSortOrder: pagination.sortOrder,
                onSortChange: handleSortChange,
            }),
        [
            handleEdit,
            handleDelete,
            pagination.sortBy,
            pagination.sortOrder,
            handleSortChange,
        ]
    );

    // Memoize table configuration
    const tableConfig = useMemo(
        () => ({
            fixedColumns: {
                left: ["id", "name"],
                right: ["actions"],
            },
        }),
        []
    );

    // Memoize filter components
    // const filterComponents = useMemo(
    //     () => <ReviewFilter filters={filters} onFilterChange={handleFilterChange} />,
    //     [filters, handleFilterChange]
    // );

    // Memoize trigger button
    const triggerButton = useMemo(
        () => <Button onClick={handleAdd}>Add Review</Button>,
        [handleAdd]
    );

    return (
        <>
            <EnhancedDataTableCard
                name="Reviews"
                columns={columns}
                data={reviewData}
                meta={response?.meta}
                // searchColumns={searchColumns}
                loading={reviewLoading}
                isError={isError}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onSortChange={handleSortChange}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search reviews by title..."
                searchValue={searchTerm}
                // filterComponents={filterComponents}
                module="review"
                trigger={triggerButton}
                tableConfig={tableConfig}
            />

            {/* {selectedReview ? (
                <EditReview review={selectedReview} open={open} setOpen={setOpen} />
            ) : (
                <AddReview open={open} setOpen={setOpen} />
            )} */}
        </>
    );
}
