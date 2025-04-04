import {useCollection} from '../../stores/CollectionStore';
import style from '../../components/setCards/setCards.module.css';
import {useEffect, useState} from 'react';
import Pagination from '../../components/pagination/Pagination.tsx';
import {getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table';
import SearchResults from '../../components/searchResults/SearchResults.tsx';
import api from '../../api/api.service.ts';
import {useUser} from '../../stores/UserStore.tsx';
import {useMutation} from '@tanstack/react-query';
import CardSkeleton from '../../components/skeletons/card-skeleton/CardSkeleton.tsx';
import {showError} from '../../utils/toastUtils.ts';
import SelectFilter from '../../components/selectFilter/SelectFilter.tsx';
import {Card} from 'pokemon-tcg-sdk-typescript/dist/interfaces/card';
import {Type} from 'pokemon-tcg-sdk-typescript/dist/enums/type';

const Collection = () => {
    const {collection} = useCollection();
    const {user} = useUser();
    const [filterTags, setFilterTags] = useState<Record<string, string>>({});
    const NUMBER_OF_PAGE = 20

    const filteredData = collection.filter((card: Card) => {
        if (filterTags) {
            return Object.entries(filterTags).every(([category, value]) => {
                switch (category) {
                    case 'set':
                        return Array.isArray(card.set.name) ? card.set.name.includes(value) : card.set.name === value;
                    case 'types':
                        return card.types?.includes(value as Type);
                    case 'rarity':
                        return card.rarity === value;
                    default:
                        return false;
                }
            });
        }
    });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: NUMBER_OF_PAGE,
    });

    const {mutate: fetchCards, isPending} = useMutation({
        mutationFn: async () => {
            if (!user?.userId) throw new Error('User not logged in');
            if (isPending) {
                return <CardSkeleton/>;
            }
            return api.card.getCard(user.userId);
        },

        onError: (error) => {
            if (error instanceof Error) {
                showError(error.message);
            }
        },
    });


    useEffect(() => {
        if (user?.userId && collection.length === 0) {
            fetchCards();
        }
    }, [user, collection.length, fetchCards]);

    const table = useReactTable({
        columns: [],
        data: collection || [],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });


    return (
        <>
            <div className={style.filterContainer}>
                <SelectFilter cards={collection} id={'set'} setFilterTags={setFilterTags} filterTags={filterTags}/>
                <SelectFilter cards={collection} id={'types'} setFilterTags={setFilterTags} filterTags={filterTags}/>
                <SelectFilter cards={collection} id={'rarity'} setFilterTags={setFilterTags} filterTags={filterTags}/>
                <button onClick={() => setFilterTags({})}>Reset</button>
            </div>

            {filteredData.length > 0 && (<div className={style.cardContainer}>
                {filteredData &&
                    filteredData
                        .slice(
                            pagination.pageIndex * pagination.pageSize,
                            pagination.pageSize + pagination.pageSize * pagination.pageIndex,
                        )
                        .map((card) => {
                            return (
                                <SearchResults key={`${card.name}${card.set.name}`} data={card}/>
                            );
                        })}
            </div>)}

            {filteredData.length === 0 && !isPending && (
                <div className={style.emptyCollection}>
                    Your collection is empty. Start adding cards!
                </div>
            )}
            {filteredData.length > 0 && (
                <Pagination table={table} pageKey={"collection"}/>
            )}
        </>
    );
};

export default Collection;