import {useUser} from '../../stores/UserStore';
import style from './account.module.css';
import {useMutation} from '@tanstack/react-query';
import {FormEvent, useState} from 'react';
import VerifPassword from '../../services/validationPassword.ts';
import api from '../../api/api.service.ts';
import {showError, showSuccess, showWarning} from '../../utils/toastUtils.ts';
import AccountCollectionInfo from "../../components/accountcollectioninfo/AccountCollectionInfo.tsx";

const Account = () => {
    const {user} = useUser();
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [formData, setFormData] = useState({
        password: '',
    });

    const mutation = useMutation({
        mutationFn: async (userData: { password: string }) => {
            user && (await api.auth.modifyPassword(userData, user?.userId));
        },
        onSuccess: () => {
            showSuccess(`Password change successfully`);
            setFormData({...formData, password: ''});
            setConfirmPassword('');
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ifPasswordValid = VerifPassword(formData, confirmPassword);

        if (ifPasswordValid.length !== 0) {
            ifPasswordValid.forEach((error) => showWarning(error));
            return;
        }
        if (ifPasswordValid.length === 0) {
            mutation.mutate(formData);
        }
    };

    return (
        <>
            <div className={style.accountContainer}>
                <h2>{user?.username}</h2>
                <div className={style.accountInfosContainer}>
                    <AccountCollectionInfo/>
                    <div className={style.accountPassword}>
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
                            <button type="submit">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
