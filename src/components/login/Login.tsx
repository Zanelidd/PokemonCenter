import {ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useUser} from '../../stores/UserStore';
import style from './login.module.css';
import VerifPassword from '../../services/validationPassword.ts';
import api from '../../api/api.service.ts';
import {showLoading, showWarning, updateLoadingToast} from '../../utils/toastUtils.ts';
import {LogingCredentials, UserTypes} from "../../types/user.types.ts";
import {handleMutationError} from "../../utils/mutationUtils.ts";
import {MutationErrorContext} from "../../types/error.types.ts";
import {ForgetPasswordResponse, RegisterResponse} from "../../types/response.types.ts";


const Login = () => {
        const [formData, setFormData] = useState({
            username: "",
            password: "",
            email: "",
        });

        const [signIn, setSignIn] = useState<boolean>(true);
        const [forgetPassword, setForgetPassword] = useState<boolean>(false);
        const [confirmPassword, setConfirmPassword] = useState<string>("");
        const [showPassword, setShowPassword] = useState(false);
        const [showPasswordBis, setShowPasswordBis] = useState(false);

        const {setLogin, toggleModal} = useUser((s) => s.actions);
        const queryClient = useQueryClient();

        const loginMutation = useMutation<{
            result: UserTypes, loadingId: string
        }, MutationErrorContext, LogingCredentials>({
            mutationFn: async (userData: LogingCredentials) => {
                const loadingId = showLoading("Signing in ...");
                try {
                    const result = await api.auth.login(userData)
                    return {result, loadingId}
                } catch (err) {
                    throw {error: err, loadingId} as MutationErrorContext
                }
            }, onSuccess: (data) => {
                setLogin(data.result.access_token)
                queryClient.setQueryData(['me'], data.result)
                queryClient.invalidateQueries({queryKey: ['collection']})
                updateLoadingToast(data.loadingId, "success", "Welcome back! 👋", `${formData.username}`);
                toggleModal();

            }, onError: (context) => {
                handleMutationError(context, "Login failed")
            }
        });

        const registerMutation = useMutation<{
            result: RegisterResponse, loadingId: string
        }, MutationErrorContext, LogingCredentials>({
            mutationFn: async (data) => {
                const loadingId = showLoading("Creating account...");
                try {
                    const result = await api.auth.register(data);
                    return {result, loadingId};
                } catch (err) {
                    throw {error: err, loadingId} as MutationErrorContext
                }
            },
            onSuccess: ({loadingId}) => {
                updateLoadingToast(loadingId, "success", "Account created!");
                setSignIn(true);
            },
            onError: (context) => {
                handleMutationError(context, "Registration failed")
            }
        });

        const forgetMutation = useMutation<{
            result: ForgetPasswordResponse, loadingId: string
        }, MutationErrorContext, string>({
            mutationFn: async (email: string) => {
                const loadingId = showLoading("Sending email...");
                try {
                    const result = await api.auth.forgetPassword(email);
                    return {result, loadingId};
                } catch (err) {
                    throw {error: err, loadingId} as MutationErrorContext
                }
            },
            onSuccess: ({loadingId}) => {
                updateLoadingToast(loadingId, "success", "Email sent!", "Check your inbox");
            },
            onError: (context) => {
                handleMutationError(context, "Error")
            }
        });


        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (signIn && !forgetPassword) {
                if (!formData.username || !formData.password) {
                    return showWarning("Please fill in all fields");
                }
                loginMutation.mutate(formData);
            } else if (!signIn && !forgetPassword) {
                if (
                    !formData.username ||
                    !formData.password ||
                    !formData.email ||
                    !confirmPassword
                ) {
                    return showWarning("Please fill in all fields");
                }

                const ifPasswordValid = VerifPassword(formData, confirmPassword);
                if (ifPasswordValid.length !== 0) {
                    ifPasswordValid.forEach((error) => showWarning(error));
                    return;
                }
                registerMutation.mutate(formData);
            } else {
                forgetMutation.mutate(formData.email);
            }
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const modalRef = useRef<HTMLDivElement>(null);

        const handleClickOutside = useCallback(
            (event: MouseEvent) => {
                if (
                    modalRef.current &&
                    !modalRef.current.contains(event.target as Node)
                ) {
                    toggleModal();
                }
            },
            [toggleModal]
        );

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };
        const togglePasswordBisVisibility = () => {
            setShowPasswordBis(!showPasswordBis);
        };

        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [handleClickOutside]);

        return (
            <div className={style.loginBack}>
                <div className={style.loginContainer} ref={modalRef}>
                    {!forgetPassword && <>
                        <div className={style.headContainer}>
                            <div
                                className={signIn ? style.activeTab : style.inactiveTab}
                                onClick={() => setSignIn(true)}
                            >
                                Sign In
                            </div>
                            <div
                                className={!signIn ? style.activeTab : style.inactiveTab}
                                onClick={() => setSignIn(false)}
                            >
                                Sign Up
                            </div>
                        </div>
                        <form
                            id="loginForm"
                            onSubmit={handleSubmit}
                            className={style.loginForm}
                        >
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loginMutation.isPending}
                                required
                            />

                            {!signIn && (
                                <>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loginMutation.isPending}
                                        required
                                    />
                                </>
                            )}
                            <label htmlFor="password">Password</label>
                            <div className={style.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    disabled={loginMutation.isPending}
                                    required
                                />
                                <button type="button" onClick={togglePasswordVisibility}>
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {!signIn && (
                                <>
                                    <label htmlFor="Confirmpassword">Repeat Password</label>
                                    <div className={style.passwordContainer}>
                                        <input
                                            type={showPasswordBis ? "text" : "password"}
                                            name="Confirmpassword"
                                            id="Confirmpassword"
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                            }}
                                            required
                                        />
                                        <button type="button" onClick={togglePasswordBisVisibility}>
                                            {showPasswordBis ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </>
                            )}
                            <button type="submit" disabled={loginMutation.isPending}>
                                {loginMutation.isPending
                                    ? `Signing ${signIn ? "in" : "up"}...`
                                    : `Sign ${signIn ? "in" : "up"}`}
                            </button>
                            {signIn &&
                                <p onClick={() => {
                                    setForgetPassword(!forgetPassword)
                                    setSignIn(!signIn)
                                }}>Forget password ?
                                </p>}
                        </form>
                    </>
                    }
                    {forgetPassword &&

                        < form id="loginForm"
                               onSubmit={handleSubmit}
                               className={style.loginForm}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loginMutation.isPending}
                                required
                            />
                            <button type="submit" disabled={loginMutation.isPending}>
                                Send Email
                            </button>
                        </form>


                    }
                </div>

            </div>
        )
            ;
    }
;

export default Login;
