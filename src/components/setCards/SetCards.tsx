import {useNavigate, useParams} from 'react-router-dom';
import style from './setCards.module.css';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table';
import {useState} from 'react';
import Pagination from '../pagination/Pagination.tsx';
import api from '../../api/api.service.ts';
import CardSkeleton from '../skeletons/card-skeleton/CardSkeleton.tsx';
import {showError, showSuccess} from '../../utils/toastUtils.ts';
import {cardResponse, CollectionCard} from "../../types/card.types.ts";
import {useCollection} from "../../stores/CollectionStore.tsx";
import {useUser} from "../../stores/UserStore.tsx";

const SetCards = () => {
    const navigate = useNavigate();
    const params = useParams();
    const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
    const NUMBER_OF_PAGE = 20
    const {isPending, error, data} = useQuery({
        queryKey: ["SetCard", `${params.setId}`],
        queryFn: async (): Promise<Array<Card>> => {
            if (params.setId) {
                const response = await api.apiCard.getCardBySet(params.setId);
                return Array.isArray(response) ? response : response.data;
            }
            return [];
        },
        staleTime: twentyFourHoursInMs,
    });

    const mutation = useMutation({
        mutationFn: async (data: Card) => {
            if (user) {
                return api.card.addCard(user.userId, data.id);
            }
            throw new Error();
        },
        onSuccess: (result, data: Card) => {
            addToCollection(data, result.id);
            showSuccess("Cards added successfully.");
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    const mutationDelete = useMutation({
        mutationFn: async (data: CollectionCard) => {
            return api.card.deleteCard(data.id);
        },
        onSuccess: (data: cardResponse) => {
            deleteFromCollection(data.remoteId);
            showSuccess("Card delete successfully");
        },
        onError: (error) => {
            showError(error.message);
        },
    })

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: NUMBER_OF_PAGE,
    });

    const table = useReactTable({
        columns: [],
        data: data ?? [],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });

    const {collection, addToCollection, deleteFromCollection, getCardById} =
        useCollection();
    const {user} = useUser()

    if (isPending) {
        return <CardSkeleton/>;
    }

    if (error) {
        showError(error.message);
        return "An error occured: " + error.message;
    }

    const handleAddCollection = (data: Card) => {
        mutation.mutate(data);
    };

    const handleDeleteCollection = (data: Card) => {
        const findCard = getCardById(data.id);
        if (findCard) {
            mutationDelete.mutate(findCard);
        } else {
            showError("Card not found in collection");
        }
    };

    return (
        <>
            <div className={style.cardContainer}>
                {data
                    .slice(
                        pagination.pageIndex * pagination.pageSize,
                        pagination.pageSize + pagination.pageSize * pagination.pageIndex
                    )
                    .map((card: Card) => {
                        const isInCollection = collection.find((test) => test.id == card.id)
                        console.log(isInCollection)
                        return (
                            <div key={card.id} className={style.cardContainerWithButton}>
                                <img
                                    className={style.card}
                                    key={card.id}

                                    src={card.images.small}
                                    alt={`image of ${card.name}`}
                                />
                                <div className={style.cardButtonContainer}>
                                <button className={style.buttonAddCardToCollection}  onClick={() => {
                                    navigate(`/card/${card.id}`);
                                }}> Infos </button>
                                {isInCollection ? <button className={style.buttonAddCardToCollection}
                                                          onClick={() => {
                                                              handleDeleteCollection(card);
                                                          }}>Delete
                                </button> : <button className={style.buttonAddCardToCollection}

                                                    onClick={() => {
                                                        handleAddCollection(card)
                                                    }}>Add
                                </button>}
                                </div>
                            </div>
                        )
                            ;
                    })}
            </div>
            <Pagination table={table} pagination={pagination}/>
        </>
    );
};

export default SetCards;
