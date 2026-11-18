import style from "../../pages/account/account.module.css";
import {FormEvent, useState} from "react";
import VerifPassword from "../../services/validationPassword.ts";
import {showWarning} from "../../utils/toastUtils.ts";
import {useMutation} from "@tanstack/react-query";
import {authService} from "../../api/auth.service.ts";
import {useNavigate} from "react-router-dom";
import {MutationErrorContext} from "../../types/error.types.ts";
import {handleMutationError} from "../../utils/mutationUtils.ts";
import {showLoading, updateLoadingToast} from "../../utils/toastUtils.ts";

const FormConfirmPass = ({token}: { token: string }) => {
    const navigate = useNavigate()
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [formData, setFormData] = useState({
        password: '',
    });

    const mutation = useMutation<{ loadingId: string }, MutationErrorContext, { password: string }>({
        mutationFn: async (userData) => {
            const loadingId = showLoading("Updating password...");
            try {
                await authService.resetPassword(token, userData.password);
                return {loadingId};
            } catch (error) {
                throw {error, loadingId} as MutationErrorContext;
            }
        },
        onSuccess: ({loadingId}) => {
            updateLoadingToast(loadingId, "success", "Password updated!", "You can now sign in");
            setFormData({password: ''});
            setConfirmPassword('');
            navigate("/home");
        },
        onError: (context) => handleMutationError(context, "Password update failed"),
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ifPasswordValid = VerifPassword(formData, confirmPassword);

        if (ifPasswordValid.length !== 0) {
            ifPasswordValid.forEach((error) => showWarning(error));
            return;
        }
        mutation.mutate(formData);
    };

    return <div className={style.accountPassword}>
        <form
            id="accountForm"
            className={style.changePassword}
            onSubmit={handleSubmit}
        >
            <label htmlFor="pass">Password</label>
            <input
                type="password"
                name="pass"
                id="pass"
                value={formData.password}
                onChange={(e) =>
                    setFormData({...formData, password: e.target.value})
                }
                placeholder="Enter your password"
                required
            />
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                }}
            />
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Updating..." : "Update Password"}
            </button>
        </form>
    </div>
}

export default FormConfirmPass