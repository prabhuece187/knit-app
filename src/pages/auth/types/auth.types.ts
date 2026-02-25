// Auth API Types
export interface RequestOtpRequest {
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

export interface Category {
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

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProfessionalDetailsResponse {
  name: string;
  mobileNumber: string;
  whatsappNumber: string;
  category: Category;
  subCategory: SubCategory;
  profileImage?: string;
  refererCode: string;
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

// Registration Step Constants
export const RegistrationStep = {
  EMAIL_VERIFICATION_PENDING: "EMAIL_VERIFICATION_PENDING",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  PROFESSIONAL_DETAILS_ADDED: "PROFESSIONAL_DETAILS_ADDED",
  SURVEY_COMPLETED: "SURVEY_COMPLETED",
  REGISTRATION_COMPLETE: "REGISTRATION_COMPLETE",
} as const;

export type RegistrationStep =
  (typeof RegistrationStep)[keyof typeof RegistrationStep];

// Navigation Step Types
export type LoginStep = "email" | "otp" | "registration" | "dashboard";
export type RegistrationStepType = "professional" | "survey" | "complete";
