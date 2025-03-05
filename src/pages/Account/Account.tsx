import { useUser } from '../../services/stores/UserStore';
import style from './account.module.css';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import VerifPassword from '../../services/validationPassword.ts';


const Account = () => {
  const { user } = useUser();
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formData,setFormData]=useState({
    password:""
  });

  const mutation = useMutation({
    mutationFn : async (userData:{
      password: string;
    }) => {

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user?.userId}`,
        {method : "PATCH",
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify(userData)}
      )

      if (!response.ok) {
        response.json()
          .then((errorData) => {
            console.log("Erreur",errorData.message);
            setPasswordErrors(errorData.message);
          })
          .catch(err => {
            console.log('Impossible de parser la réponse JSON:', err);
          });
        throw new Error(`HTTP error! status ${response.status}`);
      }
    },
    onSuccess: () => {
      console.log(`Password change success`);
      setFormData({...formData,password : ""})
      setConfirmPassword("")
    },
    onError: (error) => {
      console.error("Error", error);

    },
  })

  const handleSubmit=async (e :FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const ifPasswordValid= VerifPassword(formData, confirmPassword)

    if (ifPasswordValid.length !==0 ) {
      setPasswordErrors(ifPasswordValid)
    }
   if(ifPasswordValid.length === 0){
      mutation.mutate(formData);
     setPasswordErrors([]);
      console.log(formData);}
    }


  return (

    <div className ={style.accountContainer}>
      <h1>Account</h1>
      <p>{user?.username}</p>
      <form className={style.changePassword} onSubmit={handleSubmit}>
        <label htmlFor="password">Password</label>
        <input type="password"
               name="password"
               value={formData.password}
               onChange={(e)=>setFormData({ ...formData, password: e.target.value })}
               placeholder="..."

               required ></input>
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input type="password"
               name="Confirmpassword"
               placeholder="..."
               required
               value={confirmPassword}

               onChange={(e) => {
                setConfirmPassword(e.target.value);
        }}></input>
        <button type="submit">Submit</button>
      </form>
      {passwordErrors
        ? passwordErrors.map((err,index) => {
          return <div key={index} className={style.errorMessage}> ⚠️ {err}</div>;
        })
        : null}
    </div>


  );
};

export default Account;
