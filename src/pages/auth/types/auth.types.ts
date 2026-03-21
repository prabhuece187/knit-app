import type { District } from "@/pages/district/schema-types/district-schema";
import type { State } from "@/pages/state/schema-types/state.schema";

// Auth API Types
export interface RequestOtp {
  email: string;
}

export interface RequestOtpResponse {
  email: string;
  isNewUser: boolean;
  registrationStep: string;
  mail: string;
}

export interface ValidateOtpRequest {
  email: string;
  otp: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    subscriptionType?: string;
    subscriptionStatus?: string;
    isVerified: boolean;
    registrationStep?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
  userId: string;
}

export interface LogoutRequest {
  refreshToken: string | null;
  userId: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface CurrentUserResponse {
  id: number;
  email: string;
  subscriptionType?: string;
  subscriptionStatus?: string;
  isVerified: boolean;
}

// Registration Types
export interface ProfessionalDetailRequest {
  name: string;
  mobileNumber: string;
  whatsappNumber: string;
  categoryId: number;
  subCategoryId: number;
  profileImage?: string;
  refererCode?: string;
}

export interface ProfessionalDetailResponse {
  registrationStep: string;
  isComplete: boolean;
  nextStep: string;
  userId: number;
}

/** Nested entities from GET /auth/saved-professional-details */
export interface SavedProfessionalCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  metaDescription?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProfessionalSubCategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProfessionalDetailsResponse {
  name: string;
  mobileNumber: string;
  whatsappNumber: string;
  category: SavedProfessionalCategory;
  subCategory: SavedProfessionalSubCategory;
  profileImage?: string;
  refererCode?: string;
  state: State & { id: number };
  district: District & { id: number };
  cityName?: string;
  /** Some responses use `city` instead of `cityName`. */
  city?: string;
  pincodes: string[];
}

/** For select popovers when saved ids are not on the current API page */
export interface ProfessionalSelectFallbacks {
  state?: { id: number; name: string };
  district?: { id: number; name: string };
  category?: { id: number; name: string };
  subCategory?: { id: number; name: string };
}

export interface SurveyDetailRequest {
  mainLanguage: string;
  howDidYouKnowAboutUs?: string;
  referralSource?: string;
}

export interface SurveyDetailResponse {
  registrationStep: string;
  isComplete: boolean;
  nextStep: string;
  userId: number;
}

export interface RegistrationStatusQueryParams {
  email: string;
}

export interface RegistrationStatusResponse {
  registrationStep: string;
  isComplete: boolean;
  nextStep: string;
  userId: number;
}

// Admin Types
export interface AdminRequestOtpRequest {
  email: string;
}

export interface AdminRequestOtpResponse {
  message: string;
  email: string;
}

export interface AdminValidateOtpRequest {
  email: string;
  otp: string;
}

export interface AdminValidateOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    type: string;
    isVerified: boolean;
    isActive: boolean;
  };
}

// Navigation Step Types
export type LoginStep = "email" | "otp" | "registration" | "dashboard";
export type RegistrationStepType = "professional" | "survey" | "complete";
