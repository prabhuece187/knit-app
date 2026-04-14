import type {
  Appointment,
  AppointmentQueryParams,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/pages/appoinment/schema-types/appointment.schema";
import type {
  CreateResponse,
  DeleteResponse,
  PaginatedResponse,
  UpdateResponse,
} from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";

export const AppointmentApi = createApi({
  reducerPath: "AppointmentApi",
  baseQuery: customFetchBase,
  tagTypes: ["AppointmentTag"],
  endpoints: (build) => ({
    // Controller: GET /appointments
    getAppointments: build.query<PaginatedResponse<Appointment>, AppointmentQueryParams>({
      query: (params) => ({
        url: "appointments",
        method: "GET",
        params,
      }),
      providesTags: ["AppointmentTag"],
    }),
    // Controller: GET /appointments/:id
    getAppointmentById: build.query<Appointment, number>({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "GET",
      }),
      providesTags: ["AppointmentTag"],
    }),
    // Controller: POST /appointments (CreateAppointmentDto)
    createAppointment: build.mutation<
      CreateResponse<Appointment>,
      CreateAppointmentPayload
    >({
      query: (body) => ({
        url: "appointments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AppointmentTag"],
    }),
    // Controller: PATCH /appointments/:id (UpdateAppointmentDto)
    updateAppointment: build.mutation<
      UpdateResponse<Appointment>,
      { id: number; data: UpdateAppointmentPayload }
    >({
      query: ({ id, data }) => ({
        url: `appointments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AppointmentTag"],
    }),
    // Controller: DELETE /appointments/:id
    deleteAppointment: build.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppointmentTag"],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = AppointmentApi;
