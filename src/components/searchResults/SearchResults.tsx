import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import style from '../setCards/setCards.module.css';
import {useNavigate} from 'react-router-dom';
import {useCollection} from "../../stores/CollectionStore.tsx";
import {useMe} from "../../hook/useMe.ts";
import {useCardOperations} from "../../hook/useCardMutation.ts";

type SearchResultsProps = {
    data: Card;
};

const SearchResults = ({data}: SearchResultsProps) => {
    const navigate = useNavigate();

    const {collection} = useCollection();
    const {data: user} = useMe();
    const {
        handleAddCollection,
        handleDeleteCollection,
    } = useCardOperations();

    const isInCollection = collection.find((test) => test.id == data.id)
    return (
        <div className={style.cardContainer}>
            <div key={data.id} className={style.cardContainerWithButton}>
                <img
                    className={style.card}
                    key={data.id}
                    onClick={() => {
                        navigate(`/card/${data.id}`);
                    }}
                    src={data.images.small}
                    alt={`image of ${data.name}`}
                />
                {user ?
                    isInCollection ?
                        <button className={style.buttonAddCardToCollection}
                                onClick={() => {
                                    handleDeleteCollection(data);
                                }}
                        >-
                        </button> : <button className={style.buttonAddCardToCollection}

                                            onClick={() => {
                                                handleAddCollection(data)
                                            }}
                        >+
                        </button>
                    : null}
            </div>
        </div>
    );
};

export default SearchResults;
