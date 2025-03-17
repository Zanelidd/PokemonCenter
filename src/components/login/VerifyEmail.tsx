import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/auth.service";
import styles from "./verify-email.module.css";
import { ApiError } from "../../types/response.types";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await authService.verifyEmail(token);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", data.userId.toString());
      localStorage.setItem("username", data.username);

      setTimeout(() => {
        navigate("/home");
      }, 2500);
    },
    onError: (error: ApiError) => {
      console.error("Verification error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during verification"
      );
    },
  });

  if (!token) {
    return (
      <div className={styles.verifyContainer}>
        <div className={styles.verifyCard}>
          <h1 className={styles.verifyTitle}>Verification Error</h1>
          <div className={styles.verifyError}>Missing verification token</div>
          <button
            className={styles.verifyButton}
            onClick={() => navigate("/register")}
          >
            Back to registration
          </button>
        </div>
      </div>
    );
  }

  if (
    !verifyMutation.isPending &&
    !verifyMutation.isSuccess &&
    !verifyMutation.isError
  ) {
    verifyMutation.mutate(token);
  }

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyCard}>
        <h1 className={styles.verifyTitle}>
          {error ? "Verification Error" : "Email Verification"}
        </h1>

        {verifyMutation.isPending && (
          <>
            <div className={styles.verifySpinner} />
            <p className={styles.verifyMessage}>Verifying your email...</p>
          </>
        )}

        {error && (
          <>
            <div className={styles.verifyError}>{error}</div>
            <button
              className={styles.verifyButton}
              onClick={() => navigate("/register")}
            >
              Back to registration
            </button>
          </>
        )}

        {verifyMutation.isSuccess && (
          <p className={styles.verifyMessage}>
            Your email has been successfully verified. You will be redirected to
            the home page.
          </p>
        )}
      </div>
    </div>
  );
}
