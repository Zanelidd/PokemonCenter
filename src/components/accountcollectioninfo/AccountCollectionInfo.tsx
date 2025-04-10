import style from "../../pages/account/account.module.css";
import api from "../../api/api.service.ts";
import {showError, showSuccess} from "../../utils/toastUtils.ts";
import {useState} from "react";
import {useCollection} from "../../stores/CollectionStore.tsx";

const AccountCollectionInfo = () => {
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
    const initialPrice = 0;
    const collectionPrice = collection.reduce((acc, currentValue) => {
        const cardPrice = (currentValue.tcgplayer?.prices.normal?.mid)
            || (currentValue.tcgplayer?.prices.holofoil?.mid)
            || (currentValue.tcgplayer?.prices.reverseHolofoil?.mid)
            || 0
        return acc + cardPrice;
    }, initialPrice)

    return <div className={style.accountInfos}>
        <div className={style.collectionPrice}>
            <p>Estimated value: </p>
            <p>{Math.round(collectionPrice)} €</p>
        </div>
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
}

export default AccountCollectionInfo;