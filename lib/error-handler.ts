import { toast } from '@/hooks/use-toast';

export interface ValidationError {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

/**
 * Handles API errors and shows appropriate toast notifications
 * @param error - The error object from API response
 * @param defaultMessage - Default message to show if no specific error message
 */
export function handleApiError(error: any, defaultMessage?: string) {
  console.error('API Error:', error);

  // If it's a validation error with specific field errors
  if (error.errors && Array.isArray(error.errors)) {
    const fieldErrors = error.errors.map((err: ValidationError) => {
      return `${getFieldDisplayName(err.path)}: ${err.msg}`;
    });

    const description = fieldErrors.join(' • ');

    toast({
      title: 'Validation Error',
      description: description,
      variant: 'destructive',
    });
    return;
  }

  // If it's a general error with a message
  if (error.message) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  // Fallback to default message
  toast({
    title: 'Error',
    description: defaultMessage || 'An unexpected error occurred. Please try again.',
    variant: 'destructive',
  });
}

/**
 * Converts field names to user-friendly display names
 * @param fieldName - The field name from validation error
 * @returns User-friendly field name
 */
function getFieldDisplayName(fieldName: string): string {
  const fieldMap: Record<string, string> = {
    complainant_name: 'Complainant Name',
    phone_number: 'Phone Number',
    sub_city: 'Sub City',
    kebele: 'Kebele',
    complaint_description: 'Complaint Description',
    department: 'Department',
    office: 'Office',
    desired_action: 'Desired Action',
    full_name: 'Full Name',
    email: 'Email Address',
    service_type: 'Service Type',
    feedback_type: 'Feedback Type',
    message: 'Message',
    overall_rating: 'Overall Rating',
    courtesy_rating: 'Courtesy Rating',
    timeliness_rating: 'Timeliness Rating',
    knowledge_rating: 'Knowledge Rating',
    employee_id: 'Employee',
    comments: 'Comments',
  };

  return (
    fieldMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

/**
 * Handles success messages with toast notifications
 * @param message - Success message to display
 * @param title - Optional title for the toast
 */
export function handleApiSuccess(message: string, title?: string) {
  toast({
    title: title || 'Success',
    description: message,
    variant: 'default',
  });
}
