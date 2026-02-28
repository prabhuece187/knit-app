import { toast } from "sonner";

export const showErrorToast = (message: string) => {
    toast.error(message, { id: `error-${message}` });
};

export const showSuccessToast = (message: string) => {
    toast.success(message, { id: `success-${message}` });
};

export const formatErrorMessage = (error: any): string => {
    if (error?.data?.errors) {
        const errors = error.data.errors;
        return Object.keys(errors)
            .map(key => errors[key].join("\n"))
            .join("\n");
    }

    const errorData = error?.data;
    const errorStatus = error?.status;

    if (errorData?.message) return errorData.message;
    if (errorData?.title) {
        const detail = errorData?.detail;
        return `${errorData.title}${detail ? ". Details: " + detail.split('\n').slice(0, 3).join('\n') + (detail.split('\n').length > 3 ? '\n...' : '') : ''}`;
    }

    switch (errorStatus) {
        case 401: return "Unauthorized access (401)";
        case 403: return "Forbidden access (403)";
        case 404: return "Resource not found (404)";
        default:
            return errorStatus >= 500
                ? `Server error (${errorStatus})`
                : "Unknown error occurred";
    }
};