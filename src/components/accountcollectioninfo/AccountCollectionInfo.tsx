import style from "../accountcollectioninfo/accountCollectionInfo.module.css";
import api from "../../api/api.service.ts";
import {showError, showSuccess} from "../../utils/toastUtils.ts";
import {useEffect, useState} from "react";
import {useCollection} from "../../stores/CollectionStore.tsx";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useMe} from "../../hook/useMe.ts";

const AccountCollectionInfo = () => {
    const [validationModal, setValidationModal] = useState(false);
    const {collection, clearCollection, setCollectionFromApi} = useCollection();
    const {data: user} = useMe();

    const {data: apiCards} = useQuery({
        queryKey: ['collection', user?.userId],
        queryFn: () => api.card.getCard(user!.userId),
        enabled: !!user?.userId,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (apiCards) setCollectionFromApi(apiCards);
    }, [apiCards, setCollectionFromApi]);
    const navigate = useNavigate();

    const {mutate: deleteAll, isPending} = useMutation({
        mutationFn: () => Promise.allSettled(
            collection.map((card) => api.card.deleteCard(card.id))
        ),
        onSuccess: (results) => {
            const failedCount = results.filter(r => r.status === 'rejected').length;
            clearCollection();
            if (failedCount > 0) {
                showError(`${failedCount} card(s) could not be deleted from server`);
            } else {
                showSuccess('Collection deleted');
            }
            setValidationModal(false);
        },
    });

    const initialPrice = 0;
    const collectionPrice = collection.reduce((acc, currentValue) => {
        const cardPrice = (currentValue.tcgplayer?.prices?.normal?.mid)
            || (currentValue.tcgplayer?.prices?.holofoil?.mid)
            || (currentValue.tcgplayer?.prices?.reverseHolofoil?.mid)
            || 0
        return acc + cardPrice;
    }, initialPrice)


    return <div className={style.accountInfos}>
        {collection[collection.length - 1] && <div className={style.lastCard}>
            <h3>Last card add to the collection: </h3>
            <button type="button" onClick={() => {
                navigate(`/card/${collection[collection.length - 1].id}`)
            }}>{collection[collection.length - 1].name}</button>
        </div>}
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
                disabled={isPending}
                onClick={() => setValidationModal(!validationModal)}
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
                        disabled={isPending}
                        onClick={() => deleteAll()}
                    >
                        {isPending ? 'Deleting...' : 'Yes'}
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setValidationModal(false)}
                    >
                        No
                    </button>
                </div>
            </div>
        ) : null}
    </div>
}

export default AccountCollectionInfo;
