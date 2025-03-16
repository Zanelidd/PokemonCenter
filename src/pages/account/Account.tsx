import { useUser } from '../../stores/UserStore';
import style from './account.module.css';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import VerifPassword from '../../services/validationPassword.ts';
import { useCollection } from '../../stores/CollectionStore.tsx';
import api from '../../api/api.service.ts';

const Account = () => {
  const { user } = useUser();
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formData, setFormData] = useState({
    password: '',
  });
  const [validationModal, setValidationModal] = useState(false);
  const { collection, clearCollection } = useCollection();

  const mutation = useMutation({
    mutationFn: async (userData: {
      password: string;
    }) => {
      user && await api.auth.modifyPassword(userData, user?.userId);
    },
    onSuccess: () => {
      console.log(`Password change success`);
      setFormData({ ...formData, password: '' });
      setConfirmPassword('');
    },
    onError: (error) => {
      console.error('Error', error);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ifPasswordValid = VerifPassword(formData, confirmPassword);

    if (ifPasswordValid.length !== 0) {
      setPasswordErrors(ifPasswordValid);
    }
    if (ifPasswordValid.length === 0) {
      mutation.mutate(formData);
      setPasswordErrors([]);
    }
  };

  const handleCollectionDelete = () => {
      clearCollection();
      setValidationModal(false);
  };

  return (
    <div className={style.accountContainer}>
      <div className={style.accountInfos}>
        <p>{user?.username}</p>
        <p>Number of Cards : {collection.length}</p>

        <button type="button" onClick={() => {
          setValidationModal(!validationModal);
        }
        }>Delete collection
        </button>

        {validationModal ? <>
          <div>
            Are you sure you want to remove your collection ?
          </div>
          <button type="button" onClick={() => {
            handleCollectionDelete();
          }}>Yes
          </button>
          <button type="button" onClick={() => {
            setValidationModal(false);
          }}>No
          </button>
        </> : null
        }
      </div>
      <div className={style.accountPassword}>
        <form id="accountForm" className={style.changePassword} onSubmit={handleSubmit}>
          <label htmlFor="pass">Password</label>
          <input type="password"
                 name="pass"
                 id="pass"
                 value={formData.password}
                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                 placeholder="..."

                 required />
          <label htmlFor="password_confirmation">Confirm Password</label>
          <input type="password"
                 id="password_confirmation"
                 name="password_confirmation"
                 placeholder="..."
                 required
                 value={confirmPassword}

                 onChange={(e) => {
                   setConfirmPassword(e.target.value);
                 }} />
          <button type="submit">Submit</button>
        </form>
        {passwordErrors
          ? passwordErrors.map((err, index) => {
            return <div key={index} className={style.errorMessage}> ⚠️ {err}</div>;
          })
          : null}
      </div>
    </div>

  );
};

export default Account;
