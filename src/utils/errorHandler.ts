
import { toast } from 'sonner';

export enum ErrorType {
  VALIDATION = 'validation',
  STORAGE = 'storage',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  action?: string;
}

export class ErrorHandler {
  static handle(error: AppError | Error | string) {
    console.error('Error occurred:', error);

    if (typeof error === 'string') {
      toast.error(error);
      return;
    }

    if (error instanceof Error) {
      toast.error(error.message || 'An unexpected error occurred');
      return;
    }

    // Handle AppError
    const { type, message, action } = error;
    
    switch (type) {
      case ErrorType.VALIDATION:
        toast.error(message, {
          description: 'Please check your input and try again'
        });
        break;
      case ErrorType.STORAGE:
        toast.error(message, {
          description: 'There was an issue saving your data'
        });
        break;
      case ErrorType.NETWORK:
        toast.error(message, {
          description: 'Please check your connection and try again'
        });
        break;
      default:
        toast.error(message || 'An unexpected error occurred');
    }

    if (action) {
      toast.info(action);
    }
  }

  static success(message: string, description?: string) {
    toast.success(message, { description });
  }

  static warning(message: string, description?: string) {
    toast.warning(message, { description });
  }

  static info(message: string, description?: string) {
    toast.info(message, { description });
  }
}

// Storage error helpers
export const handleStorageError = (operation: string, error?: Error) => {
  ErrorHandler.handle({
    type: ErrorType.STORAGE,
    message: `Failed to ${operation}`,
    details: error?.message,
    action: 'Your data might not be saved. Please try again.'
  });
};

// Validation error helpers
export const handleValidationError = (field: string, requirement: string) => {
  ErrorHandler.handle({
    type: ErrorType.VALIDATION,
    message: `Invalid ${field}`,
    details: requirement
  });
};
