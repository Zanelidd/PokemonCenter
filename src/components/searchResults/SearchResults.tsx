import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import style from '../setCards/setCards.module.css';
import {useNavigate} from 'react-router-dom';
import {useCollection} from "../../stores/CollectionStore.tsx";
import {useUser} from "../../stores/UserStore.tsx";
import {useCardOperations} from "../../hook/useCardMutation.ts";

type SearchResultsProps = {
    data: Card;
};

const SearchResults = ({data}: SearchResultsProps) => {
    const navigate = useNavigate();


    const {collection} = useCollection();
    const {isAuthenticated} = useUser()
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
                {isAuthenticated ?
                    isInCollection ?
                        <button className={style.buttonAddCardToCollection}
                                onClick={() => {
                                    handleDeleteCollection(data);
                                }}
                        >Delete
                        </button> : <button className={style.buttonAddCardToCollection}

                                            onClick={() => {
                                                handleAddCollection(data)
                                            }}
                        >Add
                        </button>
                    : null}
            </div>
        </div>
    );
};

export default SearchResults;
