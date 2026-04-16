import { HttpError } from "../utils/errorUtils";

export interface MutationErrorContext {
    error: HttpError | Error;
    loadingId?: string;
}