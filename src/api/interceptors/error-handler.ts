import {useUser} from "../../stores/UserStore";
import {ResponseInterceptor} from "../../types/api.types";
import {getErrorMessageFromStatus, HttpError} from "../../utils/errorUtils";
import * as Sentry from "@sentry/react";

export const errorHandlerInterceptor: ResponseInterceptor = async (
    response: Response
) => {
    if (!response.ok) {

        Sentry.addBreadcrumb({
            category: 'http',
            message: `Error HTTP ${response.status} on ${response.url}`,
            level: 'error',
            data: {
                status: response.status,
                url: response.url,
                method: response.type,
            }
        });

        if (response.status === 401) {
            useUser.getState().logout();
        }

        let errorData;
        try {
            const clonedResponse = response.clone();
            errorData = await clonedResponse.json();
        } catch (e) {
            errorData = null;
            Sentry.captureException(e);
            const connectionError = new Error("Unable to connect to the server");
            Sentry.captureException(connectionError);
            throw connectionError;
        }

        const errorMessage =
            errorData?.message || getErrorMessageFromStatus(response.status);

        const httpError = new HttpError(response.status, errorMessage, errorData);

        Sentry.setContext("http", {
            status: response.status,
            url: response.url,
            responseData: errorData
        });
        Sentry.captureException(httpError);
        throw httpError;


    }

    return response;
};
