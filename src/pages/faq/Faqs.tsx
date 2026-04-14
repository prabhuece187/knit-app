import CommonConfirmDialogue from "@/components/common/CommonConfirmDialogue";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useDataTable } from "@/hooks/useDataTable";
import { blurActiveElement } from "@/utility/utility";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteFaqMutation, useGetFaqsQuery } from "./api/FaqApi";
import AddFaq from "./component/AddFaq";
import EditFaq from "./component/EditFaq";
import FaqFilter from "./component/FaqFilter";
import ViewFaq from "./component/ViewFaq";
import { getFaqColumns } from "./constant/faq-config";
import type { Faq, FaqQueryParams } from "./schema-types/faq.schema";

export default function Faqs() {
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
  } = useDataTable<FaqQueryParams, Faq>({
    searchField: "question",
    initialSortBy: "sortOrder",
    initialSortOrder: "asc",
  });

  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const pendingDeleteIdRef = useRef<number | null>(null);

  const {
    data: response,
    isLoading: faqLoading,
    isError,
  } = useGetFaqsQuery(queryParams);

  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const handleEdit = useCallback((faq: Faq) => {
    setSelectedFaq(faq);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedFaq(null);
    setOpen(true);
  }, []);

  const handleView = useCallback((faq: Faq) => {
    blurActiveElement();
    setSelectedFaq(faq);
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
    deleteFaq(id)
      .unwrap()
      .then((res) => {
        toast.success(res?.message ?? "FAQ deleted successfully.");
        pendingDeleteIdRef.current = null;
        setDeleteConfirmOpen(false);
      })
      .catch((error: { data?: { message?: string } }) => {
        toast.error(error?.data?.message ?? "Failed to delete FAQ.");
      });
  }, [deleteFaq]);

  useEffect(() => {
    if (response?.meta) {
      updatePaginationMeta(response.meta);
    }
  }, [response?.meta, updatePaginationMeta]);

  const faqData = response?.data ?? [];

  const columns = useMemo(
    () =>
      getFaqColumns({
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
    ],
  );

  const filterComponents = useMemo(
    () => <FaqFilter filters={filters} onFilterChange={handleFilterChange} />,
    [filters, handleFilterChange],
  );

  const triggerButton = useMemo(
    () => (
      <Button type="button" onClick={handleAdd}>
        Add FAQ
      </Button>
    ),
    [handleAdd],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="FAQs"
        columns={columns}
        data={faqData}
        meta={response?.meta}
        loading={faqLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search FAQs by question..."
        searchValue={searchTerm}
        filterComponents={filterComponents}
        module="faq"
        trigger={triggerButton}
      />

      {selectedFaq ? (
        <EditFaq faq={selectedFaq} open={open} setOpen={setOpen} />
      ) : (
        <AddFaq open={open} setOpen={setOpen} />
      )}

      {selectedFaq && (
        <ViewFaq faq={selectedFaq} open={openView} setOpen={setOpenView} />
      )}

      <CommonConfirmDialogue
        open={deleteConfirmOpen}
        setOpen={setDeleteConfirmOpen}
        title="Delete this FAQ?"
        description="This removes the FAQ permanently. You cannot undo this action."
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
