import FormConfirmPass from "../../components/formConfirmPass/FormConfirmPass.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {showError, showInfo} from "../../utils/toastUtils.ts";
import {useEffect} from "react";
import {useMutation} from "@tanstack/react-query";
import {authService} from "../../api/auth.service.ts";
import styles from "../../components/verifyEmail/verify-email.module.css";

const ForgetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const navigate = useNavigate();

    const verifyToken = useMutation({
        mutationFn: async (token: string) => {
            try {
                return await authService.verifyTokenModifyPassword(token)
            } catch (error) {
                console.log(error)
            }
        },
        onSuccess: (data) => {
            console.log(data)

        },
        onError: (error) => {
            showError(error.message)
        }
    })


    useEffect(() => {
        if (!token) {
            showError("Verification failed", "Missing verification token");
            return;
        }

        if (
            !verifyToken.isPending &&
            !verifyToken.isSuccess &&
            !verifyToken.isError
        ) {
            showInfo(
                "Verifying information",
                "Please wait while we verify your information"
            );
            verifyToken.mutate(token);
        }
    }, [token, verifyToken]);

    return <>
        <h2>Change your password </h2>
        {token && <FormConfirmPass/>}
        {!token && <div className={styles.verifyContainer}>
            <div className={styles.verifyCard}>
                <h1 className={styles.verifyTitle}>Verification Error</h1>
                <div className={styles.verifyError}>Missing verification token</div>
                <button
                    className={styles.verifyButton}
                    onClick={() => navigate("/home")}
                >
                    Back to registration
                </button>
            </div>
        </div>
        }
    </>
}

export default ForgetPassword;