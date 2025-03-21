import { useUser } from "../../stores/UserStore";
import { ResponseInterceptor } from "../../types/api.types";
import { HttpError, getErrorMessageFromStatus } from "../../utils/errorUtils";

export const errorHandlerInterceptor: ResponseInterceptor = async (
  response: Response
) => {
  if (!response.ok) {
    if (response.status === 401) {
      useUser.getState().logout();
    }

    let errorData;
    try {
      const clonedResponse = response.clone();
      errorData = await clonedResponse.json();
    } catch (e) {
      errorData = null;
    }

    const errorMessage =
      errorData?.message || getErrorMessageFromStatus(response.status);

    throw new HttpError(response.status, errorMessage, errorData);
  }

  return response;
};
