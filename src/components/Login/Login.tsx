import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../services/stores/UserStore';
import style from './login.module.css';
import { User } from '../../services/types';
import { useCollection } from '../../services/stores/CollectionStore.tsx';
import Card from '../Card/Card.tsx';

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [signIn, setSignIn] = useState<boolean>(true);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);

  const VerifPassword = () => {
    const error: string[] = [];
    if (password !== confirmPassword) {
      error.push("Password don't match");
      return false;
    }
    const validations = [
      {
        test: /[A-Z]/,
        message: "At least one uppercase letter required",
      },
      {
        test: /[a-z]/,
        message: "At least one lowercase letter required",
      },
      {
        test: /[0-9]/,
        message: "At least one number required",
      },
      {
        test: /[#?!@$%^&*-]/,
        message: "At least one special character (#?!@$%^&*-) required",
      },
      {
        test: /.{8,}/,
        message: "Password must be at least 8 characters long",
      },
    ];

    for (const validation of validations) {
      if (!validation.test.test(password)) {
        error.push(validation.message);
      }
    }

    setPasswordErrors(error);
    if (error.length === 0) {
      setFormData({ ...formData, password: password });
      return true;
    }
    return false;
  };

  const { login, setUser } = useUser();
  const { addToCollection } = useCollection();

  const mutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      email: string;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${
          signIn ? "signIn" : "signUp"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
 response.json()
   .then((errorData) => {
   console.log("Erreur",errorData.message);
 })
   .catch(err => {
     console.log('Impossible de parser la réponse JSON:', err);
   });
        throw new Error(`HTTP error! status ${response.status}`);
      }

      const result: User = await response.json();
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/card/${result.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          result.map((card: Card) => {
            addToCollection(card, result.userId);
          });
        });

      signIn
        ? login(result.username, result.access_token, result.userId)
        : setUser(result);
    },
    onSuccess: () => {
      console.log(`${signIn ? "Connection" : "Inscription"} success`);
      // Penser à intégrer l'ID du user
      setSignIn(true);
      toggleModal();
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signIn) {
      mutation.mutate(formData);
    } else {
      if (VerifPassword()) {
        mutation.mutate(formData);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signUpHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
          <div className={signIn ? style.activeTab : style.inactiveTab} onClick={() => setSignIn(true)}>Sign In</div>
          <div className={!signIn ? style.activeTab : style.inactiveTab} onClick={() => setSignIn(false)}>Sign Up</div>
        </div>
        <form onSubmit={handleSubmit} className={style.loginForm}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            disabled={mutation.isPending}
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
              />
            </>
          )}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={signIn ? handleChange : signUpHandler}
            disabled={mutation.isPending}
          />
          {!signIn && (
            <>
              <label htmlFor="Confirmpassword">Repeat Password</label>
              <input
                type="password"
                name="Confirmpassword"
                id="Confirmpassword"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </>
          )}
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? `Signing ${signIn ? "in" : "up"}...`
              : `Sign ${signIn ? "in" : "up"}`}
          </button>
          {passwordErrors
            ? passwordErrors.map((err) => {
                return <div>{err}</div>;
              })
            : null}
        </form>
      </div>
    </div>
  );
};

export default Login;
