import {useCollection} from '../../stores/CollectionStore';
import style from '../../components/setCards/setCards.module.css';
import {useEffect, useMemo, useRef, useState} from 'react';
import Pagination from '../../components/pagination/Pagination.tsx';
import {getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table';
import SearchResults from '../../components/searchResults/SearchResults.tsx';
import api from '../../api/api.service.ts';
import {useQuery} from '@tanstack/react-query';
import CardSkeleton from '../../components/skeletons/card-skeleton/CardSkeleton.tsx';
import {showError} from '../../utils/toastUtils.ts';
import SelectFilter from '../../components/selectFilter/SelectFilter.tsx';
import {Card} from 'pokemon-tcg-sdk-typescript/dist/interfaces/card';
import {Type} from 'pokemon-tcg-sdk-typescript/dist/enums/type';
import {useMe} from "../../hook/useMe.ts";

const Collection = () => {
    const {collection, setCollectionFromApi} = useCollection();
    const {data: user} = useMe();

    const [filterTags, setFilterTags] = useState<Record<string, string>>({});
    const NUMBER_OF_PAGE = 20;

    const filteredData = useMemo(() => {
        const entries = Object.entries(filterTags);
        if (entries.length === 0) return collection;
        return collection.filter((card: Card) =>
            entries.every(([category, value]) => {
                switch (category) {
                    case 'set':
                        return card.set.name === value;
                    case 'types':
                        return card.types?.includes(value as Type);
                    case 'rarity':
                        return card.rarity === value;
                    default:
                        return false;
                }
            })
        );
    }, [collection, filterTags]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: NUMBER_OF_PAGE,
    });

    const {data: apiCards, isPending, error} = useQuery({
        queryKey: ['collection', user?.userId],
        queryFn: () => api.card.getCard(user!.userId),
        enabled: !!user?.userId,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (error) showError(error.message);
    }, [error]);

    const initialized = useRef(false);
    useEffect(() => {
        if (apiCards && !initialized.current) {
            setCollectionFromApi(apiCards);
            initialized.current = true;
        }
    }, [apiCards, setCollectionFromApi]);

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

    if (isPending && collection.length === 0) {
        return <CardSkeleton/>;
    }

    return (
        <>
            <div className={style.filterContainer}>
                <SelectFilter cards={collection} id={'set'} setFilterTags={setFilterTags} filterTags={filterTags}/>
                <SelectFilter cards={collection} id={'types'} setFilterTags={setFilterTags} filterTags={filterTags}/>
                <SelectFilter cards={collection} id={'rarity'} setFilterTags={setFilterTags} filterTags={filterTags}/>
                <button onClick={() => setFilterTags({})}>Reset</button>
            </div>

            {filteredData.length > 0 && (
                <div className={style.cardContainer}>
                    {filteredData
                        .slice(
                            pagination.pageIndex * pagination.pageSize,
                            pagination.pageSize + pagination.pageSize * pagination.pageIndex,
                        )
                        .map((card) => (
                            <SearchResults key={card.id} data={card}/>
                        ))}
                </div>
            )}

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
