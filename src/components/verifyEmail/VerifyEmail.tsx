import {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {authService} from '../../api/auth.service.ts';
import styles from './verify-email.module.css';
import {ApiError} from '../../types/response.types.ts';
import {useUser} from '../../stores/UserStore.tsx';
import {showError, showInfo, showSuccess} from '../../utils/toastUtils';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const {setUser} = useUser();

    const verifyMutation = useMutation({
        mutationFn: async (token: string) => {
            try {
                return await authService.verifyEmail(token);
            } catch (error) {
                const apiError = error as ApiError;
                throw new Error(
                    apiError.response?.data?.message ||
                    apiError.message ||
                    "Failed to verify email"
                );
            }
        },
        onSuccess: (data) => {
            setUser(data);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("userId", data.userId.toString());
            localStorage.setItem("username", data.username);

            showSuccess(
                "Email verified successfully!",
                "You will be redirected to the home page"
            );
        },

        onError: (error: Error) => {
            console.error("Verification error:", error);
            showError("Email verification failed", error.message);
        },
    });
    setTimeout(() => {
        return navigate("/home");
    }, 3500);

    useEffect(() => {
        if (!token) {
            showError("Verification failed", "Missing verification token");
            return;
        }

        if (
            !verifyMutation.isPending &&
            !verifyMutation.isSuccess &&
            !verifyMutation.isError
        ) {
            showInfo(
                "Verifying email",
                "Please wait while we verify your email address"
            );
            verifyMutation.mutate(token);
        }
    }, [token, verifyMutation]);

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

    return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyCard}>
                <h1 className={styles.verifyTitle}>
                    {verifyMutation.isError ? "Verification Error" : "Email Verification"}
                </h1>

                {verifyMutation.isPending && (
                    <>
                        <div className={styles.verifySpinner}/>
                        <p className={styles.verifyMessage}>Verifying your email...</p>
                    </>
                )}

                {verifyMutation.isError && (
                    <>
                        <div className={styles.verifyError}>
                            {verifyMutation.error.message}
                        </div>
                        <button
                            className={styles.verifyButton}
                            onClick={() => {
                                verifyMutation.reset();
                                navigate("/register");
                            }}
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
