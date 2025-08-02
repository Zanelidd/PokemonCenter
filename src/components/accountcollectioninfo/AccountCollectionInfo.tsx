import style from "../accountcollectioninfo/accountCollectionInfo.module.css";
import api from "../../api/api.service.ts";
import {showError, showSuccess} from "../../utils/toastUtils.ts";
import {useState} from "react";
import {useCollection} from "../../stores/CollectionStore.tsx";
import {useNavigate} from "react-router-dom";

const AccountCollectionInfo = () => {
    const [validationModal, setValidationModal] = useState(false);
    const {collection, clearCollection} = useCollection();
    const navigate = useNavigate();

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
    const initialPrice = 0;
    const collectionPrice = collection.reduce((acc, currentValue) => {
        const cardPrice = (currentValue.tcgplayer?.prices.normal?.mid)
            || (currentValue.tcgplayer?.prices.holofoil?.mid)
            || (currentValue.tcgplayer?.prices.reverseHolofoil?.mid)
            || 0
        return acc + cardPrice;
    }, initialPrice)


    return <div className={style.accountInfos}>
        <div className={style.lastCard}>
            <h3>Last card add to the collection: </h3>
            <p onClick={() => {
                navigate(`/card/${collection[collection.length - 1].id}`)
            }}>{collection[collection.length - 1].name}</p>
        </div>
        <div className={style.accountContainer}>
            <h3>Estimated value: </h3>
            <p>{Math.round(collectionPrice)} $</p>
        </div>
        <div className={style.accountContainer}>
            <h3 className={style.accountNumberCard}>Number of Cards: </h3>
            <p>{collection.length}</p>
            <button
                className={style.buttonConfirmAccount}
                type="button"
                onClick={() => {
                    setValidationModal(!validationModal);
                }}
            >

                Delete collection
            </button>
        </div>



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
}

export default AccountCollectionInfo;