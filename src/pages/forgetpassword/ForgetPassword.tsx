import FormConfirmPass from "../../components/formConfirmPass/FormConfirmPass.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {showError, showInfo} from "../../utils/toastUtils.ts";
import {useEffect, useRef} from "react";
import {useMutation} from "@tanstack/react-query";
import {authService} from "../../api/auth.service.ts";
import styles from "../../components/verifyEmail/verify-email.module.css";

const ForgetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const called = useRef(false);

    const verifyToken = useMutation({
        mutationFn: (t: string) => authService.verifyTokenModifyPassword(t),
        onError: (error) => {
            showError(error.message);
        },
    });

    useEffect(() => {
        if (!token) {
            showError("Verification failed", "Missing verification token");
            return;
        }
        if (!called.current) {
            called.current = true;
            showInfo("Verifying information", "Please wait while we verify your information");
            verifyToken.mutate(token);
        }
    }, [token]);

    if (!token) {
        return (
            <div className={styles.verifyContainer}>
                <div className={styles.verifyCard}>
                    <h1 className={styles.verifyTitle}>Verification Error</h1>
                    <div className={styles.verifyError}>Missing verification token</div>
                    <button className={styles.verifyButton} onClick={() => navigate("/home")}>
                        Back to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <h2>Change your password</h2>

            {verifyToken.isPending && (
                <div className={styles.verifyContainer}>
                    <div className={styles.verifyCard}>
                        <div className={styles.verifySpinner}/>
                        <p className={styles.verifyMessage}>Verifying your reset link...</p>
                    </div>
                </div>
            )}

            {verifyToken.isError && (
                <div className={styles.verifyContainer}>
                    <div className={styles.verifyCard}>
                        <h1 className={styles.verifyTitle}>Verification Error</h1>
                        <div className={styles.verifyError}>Invalid or expired reset link.</div>
                        <button className={styles.verifyButton} onClick={() => navigate("/home")}>
                            Back to home
                        </button>
                    </div>
                </div>
            )}

            {verifyToken.isSuccess && <FormConfirmPass/>}
        </>
    );
};

export default ForgetPassword;
