import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../services/stores/UserStore';
import style from './login.module.css';
import { User } from '../../services/types';
import { useCollection } from '../../services/stores/CollectionStore.tsx';
import Card from '../Card/Card.tsx';
import VerifPassword from '../../services/validationPassword.ts';

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [signIn, setSignIn] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBis, setShowPasswordBis] = useState(false);

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
            throw errorData;
          })
          .catch(err => {
            console.log('Unable to parse JSON response:', err);
            setPasswordErrors(err.message);
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

      const ifPasswordValid= VerifPassword(formData, confirmPassword)
      if (ifPasswordValid.length !==0 ) {
        setPasswordErrors(ifPasswordValid)
      }
      if(ifPasswordValid.length === 0){
        mutation.mutate(formData);
        setPasswordErrors([]);
        console.log(formData);}
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

  const togglePasswordVisibility=()=>{
    setShowPassword(!showPassword);

  }
  const togglePasswordBisVisibility=()=>{
    setShowPasswordBis(!showPasswordBis);
  }

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
            onChange={ handleChange }
            disabled={mutation.isPending}
            required
          />
          <button type="button"  onClick={togglePasswordVisibility}>
            {showPassword ? "🙈" : "👁️"}</button>
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
              <button type="button"  onClick={togglePasswordBisVisibility}>
                {showPasswordBis ? "🙈" : "👁️"}</button>
              </div>
            </>
          )}
          <button type="submit" disabled={mutation.isPending} onClick={()=>  setPasswordErrors([])
          }>
            {mutation.isPending
              ? `Signing ${signIn ? "in" : "up"}...`
              : `Sign ${signIn ? "in" : "up"}`}
          </button>
        </form>
        {passwordErrors &&
           (Array.isArray(passwordErrors)
            ? passwordErrors.map((err,index) =>{
             return <div key={index} className={style.errorMessage}> ⚠️ {err}</div>
            })
            :  <div className={style.errorMessage}> ⚠️ {passwordErrors}</div> )}
      </div>
    </div>
  );
};

export default Login;
