import { HttpError } from "./errorUtils";
import {showError, updateLoadingToast} from "./toastUtils.ts";
import {MutationErrorContext} from "../types/error.types.ts";

export const handleMutationError = (
    context: MutationErrorContext,
    defaultTitle: string,
    fallbackMessage: string = "An unexpected error occurred"
) => {
    const { error, loadingId } = context;


    const errorMessage = error instanceof HttpError
        ? error.message
        : error?.message || fallbackMessage;


    if (loadingId) {
        updateLoadingToast(
            loadingId,
            "error",
            defaultTitle,
            errorMessage
        );
    } else {
        showError(defaultTitle, errorMessage);
    }

    // 3. Log optionnel pour le dev
    console.error(`[${defaultTitle}]`, error);
};