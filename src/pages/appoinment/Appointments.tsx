import CommonConfirmDialogue from "@/components/common/CommonConfirmDialogue";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/useDataTable";
import { blurActiveElement } from "@/utility/utility";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
} from "./api/AppointmentApi";
import AddAppointment from "./component/AddAppointment";
import AppointmentFilter from "./component/AppointmentFilter";
import EditAppointment from "./component/EditAppointment";
import ViewAppointment from "./component/ViewAppointment";
import { getAppointmentColumns } from "./constant/appointment-config";
import type {
  Appointment,
  AppointmentQueryParams,
} from "./schema-types/appointment.schema";

export default function Appointments() {
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
  } = useDataTable<AppointmentQueryParams, Appointment>({
    searchField: "serviceType",
    initialSortBy: "appointmentDate",
    initialSortOrder: "desc",
  });

  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const pendingDeleteIdRef = useRef<number | null>(null);

  const {
    data: response,
    isLoading: appointmentLoading,
    isError,
  } = useGetAppointmentsQuery(queryParams);

  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();

  const handleEdit = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedAppointment(null);
    setOpen(true);
  }, []);

  const handleView = useCallback((appointment: Appointment) => {
    blurActiveElement();
    setSelectedAppointment(appointment);
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
    deleteAppointment(id)
      .unwrap()
      .then((res) => {
        toast.success(res?.message ?? "Appointment deleted successfully.");
        pendingDeleteIdRef.current = null;
        setDeleteConfirmOpen(false);
      })
      .catch((error: { data?: { message?: string } }) => {
        toast.error(error?.data?.message ?? "Failed to delete appointment.");
      });
  }, [deleteAppointment]);

  useEffect(() => {
    if (response?.meta) {
      updatePaginationMeta(response.meta);
    }
  }, [response?.meta, updatePaginationMeta]);

  const appointmentData = response?.data ?? [];

  const columns = useMemo(
    () =>
      getAppointmentColumns({
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
    () => <AppointmentFilter filters={filters} onFilterChange={handleFilterChange} />,
    [filters, handleFilterChange],
  );

  const triggerButton = useMemo(
    () => (
      <Button type="button" onClick={handleAdd}>
        Add Appointment
      </Button>
    ),
    [handleAdd],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Appointments"
        columns={columns}
        data={appointmentData}
        meta={response?.meta}
        loading={appointmentLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search appointments by service..."
        searchValue={searchTerm}
        filterComponents={filterComponents}
        module="appointment"
        trigger={triggerButton}
      />

      {selectedAppointment ? (
        <EditAppointment
          appointment={selectedAppointment}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddAppointment open={open} setOpen={setOpen} />
      )}

      {selectedAppointment && (
        <ViewAppointment
          appointment={selectedAppointment}
          open={openView}
          setOpen={setOpenView}
        />
      )}

      <CommonConfirmDialogue
        open={deleteConfirmOpen}
        setOpen={setDeleteConfirmOpen}
        title="Delete this appointment?"
        description="This removes the appointment permanently. You cannot undo this action."
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
