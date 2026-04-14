import type { PaginationQueryType } from "@/schema-types/pagination-schema";
import { z } from "zod";

export const meetingTypeSchema = z.enum(["IN_PERSON", "ONLINE", "PHONE"]);
export type MeetingType = z.infer<typeof meetingTypeSchema>;

export const appointmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const appointmentProfessionalSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  subCategory: z.string(),
});

export const appointmentVisitorSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export const appointmentSchema = z.object({
  id: z.number(),
  professionalId: z.number(),
  visitorId: z.number().nullable().optional(),
  appointmentDate: z.string(),
  appointmentTime: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  serviceType: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  meetingType: meetingTypeSchema,
  status: appointmentStatusSchema,
  cancelReason: z.string().nullable().optional(),
  confirmedAt: z.string().nullable().optional(),
  confirmedBy: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  professional: appointmentProfessionalSchema.optional(),
  visitor: appointmentVisitorSchema.nullable().optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

const optionalTextField = z.string().max(500).optional().or(z.literal(""));

export const createVisitorSchema = z.object({
  name: z.string().min(1, "Visitor name is required"),
  email: z.string().email("Valid visitor email is required"),
  phone: z.string().optional(),
});
export type CreateVisitorPayload = z.infer<typeof createVisitorSchema>;

export const createAppointmentSchema = z.object({
  professionalId: z.number().int().positive("Professional ID is required"),
  visitorId: z.number().int().positive().optional(),
  visitor: createVisitorSchema.optional(),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().optional().or(z.literal("")),
  duration: z.number().int().positive().optional(),
  serviceType: optionalTextField,
  notes: optionalTextField,
  location: optionalTextField,
  meetingType: meetingTypeSchema,
  status: appointmentStatusSchema,
  cancelReason: optionalTextField,
  confirmedAt: z.string().optional().or(z.literal("")),
  confirmedBy: optionalTextField,
});

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>;

export const editAppointmentSchema = createAppointmentSchema;
export type EditAppointmentFormValues = z.infer<typeof editAppointmentSchema>;

export type CreateAppointmentPayload = {
  professionalId: number;
  visitorId?: number;
  visitor?: CreateVisitorPayload;
  appointmentDate: string;
  appointmentTime?: string;
  duration?: number;
  serviceType?: string;
  notes?: string;
  location?: string;
  meetingType?: MeetingType;
  status?: AppointmentStatus;
  cancelReason?: string;
  confirmedAt?: string;
  confirmedBy?: string;
};

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>;

export interface AppointmentQueryParams extends PaginationQueryType {
  status?: AppointmentStatus | string;
  meetingType?: MeetingType | string;
  professionalId?: number | string;
  visitorId?: number | string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  serviceType?: string;
  sortBy?: "appointmentDate" | "createdAt" | "updatedAt" | "status" | string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}
