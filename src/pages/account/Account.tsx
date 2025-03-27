import {useUser} from '../../stores/UserStore';
import style from './account.module.css';
import {useState} from 'react';
import {useCollection} from '../../stores/CollectionStore.tsx';
import api from '../../api/api.service.ts';
import {showError, showSuccess} from '../../utils/toastUtils.ts';
import FormConfirmPass from "../../components/formConfirmPass/FormConfirmPass.tsx";

const Account = () => {
    const {user} = useUser();
    const [validationModal, setValidationModal] = useState(false);
    const {collection, clearCollection} = useCollection();

    const handleCollectionDelete = () => {
        Promise.all(
            collection.map((card) => {
                return api.card.deleteCard(card.id);
            })
        )
            .then(() => {
                clearCollection()
                showSuccess('Collection now is gone...')
                setValidationModal(false);
            })
            .catch((error) => showError(error.message));
    };

    return (
        <>
            <div className={style.accountContainer}>
                <h2>{user?.username}</h2>
                <div className={style.accountInfosContainer}>
                    <div className={style.accountInfos}>
                        <p className={style.accountNumberCard}>Number of Cards: {collection.length}</p>
                        <button
                            className={style.buttonConfirmAccount}
                            type="button"
                            onClick={() => {
                                setValidationModal(!validationModal);
                            }}
                        >
                            Delete collection
                        </button>
                        {validationModal ? (
                            <div className={style.confirmationModal}>
                                <div>Are you sure you want to delete your collection?</div>
                                <div className={style.buttonConfirm}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleCollectionDelete();
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setValidationModal(false);
                                        }}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <FormConfirmPass/>
                </div>
            </div>
        </>
    );
};

export default Account;
