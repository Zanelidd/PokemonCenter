import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../stores/UserStore";
import style from "./login.module.css";
import VerifPassword from "../../services/validationPassword.ts";
import api from "../../api/api.service.ts";
import {
  showSuccess,
  showError,
  showWarning,
  showLoading,
  updateLoadingToast,
} from "../../utils/toastUtils.ts";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [signIn, setSignIn] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBis, setShowPasswordBis] = useState(false);

  const { login, user } = useUser();

  const mutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      email: string;
    }) => {
      const loadingId = showLoading(
        signIn ? "Signing in..." : "Creating your account..."
      );
      try {
        if (signIn) {
          const response = await api.auth.login(userData);
          const result = await response;
          login(result.username, result.access_token, result.userId);
          return { result, loadingId };
        } else {
          const response = await api.auth.register(userData);
          const result = await response;
          return { result, loadingId };
        }
      } catch (error) {
        throw { error, loadingId };
      }
    },
    onSuccess: (data) => {
      if (signIn) {
        showSuccess("Welcome back! 👋", `${formData.username}`);
        user && api.card.getCard(user?.userId);
        toggleModal();
      } else {
        updateLoadingToast(
          data.loadingId,
          "success",
          "Mail sent successfully! ✨",
          "Please check your email to verify your account"
        );
        setSignIn(true);
      }
    },
    onError: (error: { error?: { message?: string }; loadingId?: string }) => {
      const errorMessage =
        error.error?.message || "An unexpected error occurred";
      if (error.loadingId) {
        updateLoadingToast(
          error.loadingId,
          "error",
          errorMessage,
          signIn
            ? "Please check your credentials and try again"
            : "Registration failed"
        );
      } else {
        showError(
          errorMessage,
          signIn
            ? "Please check your credentials and try again"
            : "Registration failed"
        );
      }
      if (!signIn) {
        showError(errorMessage);
      }
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signIn) {
      if (!formData.username || !formData.password) {
        showWarning("Please fill in all fields");
        return;
      }
      mutation.mutate(formData);
    } else {
      if (
        !formData.username ||
        !formData.password ||
        !formData.email ||
        !confirmPassword
      ) {
        showWarning("Please fill in all fields");
        return;
      }
      const ifPasswordValid = VerifPassword(formData, confirmPassword);
      if (ifPasswordValid.length !== 0) {
        ifPasswordValid.forEach((error) => showWarning(error));
        return;
      }
      mutation.mutate(formData);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { toggleModal } = useUser();
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
            disabled={mutation.isPending}
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
                disabled={mutation.isPending}
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
              disabled={mutation.isPending}
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
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? `Signing ${signIn ? "in" : "up"}...`
              : `Sign ${signIn ? "in" : "up"}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
