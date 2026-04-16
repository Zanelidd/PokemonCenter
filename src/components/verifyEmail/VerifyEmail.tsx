import {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authService} from '../../api/auth.service.ts';
import styles from './verify-email.module.css';
import {showError, showInfo, showLoading, updateLoadingToast} from '../../utils/toastUtils';
import {UserTypes} from "../../types/user.types.ts";
import {MutationErrorContext} from "../../types/error.types.ts";
import {useAuthActions} from "../../stores/UserStore.tsx";
import {handleMutationError} from "../../utils/mutationUtils.ts";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const {setLogin} = useAuthActions()
    const queryClient = useQueryClient()

    const verifyMutation = useMutation<{ user: UserTypes; loadingId: string }, MutationErrorContext, string>({
                mutationFn: async (token: string) => {
                    const loadingId = showLoading("Verification in process ...")
                    try {
                        const result = await authService.verifyEmail(token);
                        return {user: result, loadingId}
                    } catch (error) {
                        throw {error, loadingId} as MutationErrorContext
                    }
                },
                onSuccess: ({user, loadingId}) => {
                    setLogin(user.access_token);
                    queryClient.setQueryData(['me'], user);

                    updateLoadingToast(
                        loadingId,
                        "success",
                        "Email verified successfully!",
                        "You will be redirected to the home page"
                    );
                    setTimeout(() => {
                        return navigate("/home");
                    }, 3500);
                },

                onError: (context) => handleMutationError(context, "Email verification failed")

            }
        )
    ;


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
                            {verifyMutation.error.error.message}
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
