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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateAppointmentMutation } from "../api/AppointmentApi";
import {
  editAppointmentSchema,
  type Appointment,
  type EditAppointmentFormValues,
  type UpdateAppointmentPayload,
} from "../schema-types/appointment.schema";

export default function EditAppointment({
  open,
  setOpen,
  appointment,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointment: Appointment;
}) {
  const [updateAppointment] = useUpdateAppointmentMutation();

  const form = useForm<EditAppointmentFormValues>({
    resolver: zodResolver(editAppointmentSchema),
    defaultValues: {
      professionalId: 0,
      visitorId: undefined,
      appointmentDate: "",
      appointmentTime: "",
      duration: undefined,
      serviceType: "",
      notes: "",
      location: "",
      meetingType: "IN_PERSON",
      status: "PENDING",
      cancelReason: "",
      confirmedAt: "",
      confirmedBy: "",
    },
  });

  useEffect(() => {
    if (open && appointment) {
      form.reset({
        professionalId: appointment.professionalId,
        visitorId: appointment.visitorId ?? undefined,
        appointmentDate: appointment.appointmentDate?.slice(0, 10) ?? "",
        appointmentTime: appointment.appointmentTime ?? "",
        duration: appointment.duration ?? undefined,
        serviceType: appointment.serviceType ?? "",
        notes: appointment.notes ?? "",
        location: appointment.location ?? "",
        meetingType: appointment.meetingType,
        status: appointment.status,
        cancelReason: appointment.cancelReason ?? "",
        confirmedAt: appointment.confirmedAt
          ? new Date(appointment.confirmedAt).toISOString().slice(0, 16)
          : "",
        confirmedBy: appointment.confirmedBy ?? "",
      });
    }
  }, [open, appointment, form]);

  function trimOrUndefined(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }

  function toIsoDate(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);
    return Number.isNaN(date.getTime()) ? dateValue : date.toISOString();
  }

  function toIsoDateTime(value?: string) {
    const trimmed = trimOrUndefined(value);
    if (!trimmed) return undefined;
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? trimmed : date.toISOString();
  }

  function buildPayload(values: EditAppointmentFormValues): UpdateAppointmentPayload {
    return {
      professionalId: values.professionalId,
      visitorId: values.visitorId,
      appointmentDate: toIsoDate(values.appointmentDate),
      appointmentTime: trimOrUndefined(values.appointmentTime),
      duration: values.duration,
      serviceType: trimOrUndefined(values.serviceType),
      notes: trimOrUndefined(values.notes),
      location: trimOrUndefined(values.location),
      meetingType: values.meetingType,
      status: values.status,
      cancelReason: trimOrUndefined(values.cancelReason),
      confirmedAt: toIsoDateTime(values.confirmedAt),
      confirmedBy: trimOrUndefined(values.confirmedBy),
    };
  }

  function onSubmit(values: EditAppointmentFormValues) {
    updateAppointment({ id: appointment.id, data: buildPayload(values) })
      .unwrap()
      .then((response) => {
        toast.success(response.message ?? "Appointment updated successfully.");
        form.reset();
        setOpen(false);
      })
      .catch((error: { data?: { message?: string } }) => {
        toast.error(error?.data?.message ?? "Failed to update appointment.");
      });
  }

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Appointment" />
          </DialogTitle>
          <DialogDescription>Update this appointment entry.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-appointment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="professionalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional ID*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visitorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visitor ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Meeting type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IN_PERSON">In Person</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="PHONE">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Consultation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." className="min-h-[90px] resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="confirmedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmed at</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmed by</FormLabel>
                    <FormControl>
                      <Input placeholder="professional/admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cancelReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancel reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Reason if cancelled..." className="min-h-[90px] resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
