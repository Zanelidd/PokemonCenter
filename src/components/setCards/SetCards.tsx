import {useNavigate, useParams} from 'react-router-dom';
import style from './setCards.module.css';
import {useQuery} from '@tanstack/react-query';
import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table';
import {useState} from 'react';
import Pagination from '../pagination/Pagination.tsx';
import api from '../../api/api.service.ts';
import CardSkeleton from '../skeletons/card-skeleton/CardSkeleton.tsx';
import {showError} from '../../utils/toastUtils.ts';
import {useCollection} from "../../stores/CollectionStore.tsx";
import {useUser} from "../../stores/UserStore.tsx";
import {useCardOperations} from '../../hook/useCardMutation.ts';

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
    const {collection} = useCollection();
    const {isAuthenticated} = useUser()
    const {
        handleAddCollection,
        handleDeleteCollection,
    } = useCardOperations();


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

    if (isPending) {
        return <CardSkeleton/>;
    }

    if (error) {
        showError(error.message);
        return "An error occured: " + error.message;
    }

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
                        return (
                            <div key={card.id} className={style.cardContainerWithButton}>
                                <img
                                    className={style.card}
                                    key={card.id}
                                    onClick={() => {
                                        navigate(`/card/${card.id}`)
                                    }}
                                    src={card.images.small}
                                    alt={`image of ${card.name}`}
                                />
                                {isAuthenticated ?
                                    isInCollection ?
                                        <button className={style.buttonAddCardToCollection}
                                                onClick={() => {
                                                    handleDeleteCollection(card);
                                                }}
                                        >Delete
                                        </button> : <button className={style.buttonAddCardToCollection}

                                                            onClick={() => {
                                                                handleAddCollection(card)
                                                            }}
                                        >Add
                                        </button>
                                    : null}

                            </div>
                        )
                            ;
                    })}
            </div>
            <Pagination table={table} pagination={pagination}/>
        </>
    )
        ;
};

export default SetCards;
