import { toast } from 'sonner';

export const showSuccess = (message: string, details?: string): void => {
  toast.success(message, {
    description: details,
    duration: 3000,
  });
};

export const showInfo = (message: string, details?: string): void => {
  toast.info(message, {
    description: details,
    duration: 4000,
  });
};

export const showWarning = (message: string, details?: string): void => {
  toast.warning(message, {
    description: details,
    duration: 5000,
  });
};

export const showError = (
  message: string,
  details?: string,
  retryFn?: () => void
): void => {
  toast.error(message, {
    description: details,
    duration: 8000,
    action: retryFn
      ? {
          label: "Retry",
          onClick: retryFn,
        }
      : undefined,
  });
};

export const showLoading = (message: string): string => {
  const id = Date.now().toString();
  toast.loading(message, {
    id,
    duration: Infinity,
  });
  return id;
};

export const updateLoadingToast = (
  id: string,
  type: "success" | "error",
  message: string,
  details?: string
): void => {
  toast.dismiss(id);
  if (type === "success") {
    showSuccess(message, details);
  } else {
    showError(message, details);
  }
};

export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> => {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: (err) => {
     return err.message
       
    },
  });
  return promise;
};

export const showConfirmation = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  toast(message, {
    action: {
      label: "Confirm",
      onClick: () => {
        if (onConfirm) onConfirm();
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => {
        if (onCancel) onCancel();
      },
    },
    duration: 10000,
  });
};
