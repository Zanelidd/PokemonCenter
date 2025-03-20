import { useCollection } from '../../stores/CollectionStore';
import style from '../../components/setCards/setCards.module.css';
import { useEffect, useState } from 'react';
import Pagination from '../../components/pagination/Pagination.tsx';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import SearchResults from '../../components/searchResults/SearchResults.tsx';
import api from '../../api/api.service.ts';
import { useUser } from '../../stores/UserStore.tsx';
import { useMutation } from '@tanstack/react-query';
import CardSkeleton from '../../components/skeletons/card-skeleton/CardSkeleton.tsx';
import { showError } from '../../utils/toastUtils.ts';
import SelectFilter from '../../components/selectFilter/SelectFilter.tsx';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/interfaces/card';
import { Type } from 'pokemon-tcg-sdk-typescript/dist/enums/type';

const Collection = () => {
    const { collection } = useCollection();
    const { user } = useUser();
    const [filterTags, setFilterTags] = useState<Record<string, string>>({});

    const filteredData = collection.filter((card: Card) => {
      if (filterTags) {
        return Object.entries(filterTags).every(([category, value]) => {
          switch (category) {
            case 'set':
              return Array.isArray(card.set.id) ? card.set.id.includes(value) : card.set.id === value;
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
      pageSize: 20,
    });

    const { mutate: fetchCards, isPending } = useMutation({
      mutationFn: async () => {
        if (!user?.userId) throw new Error('User not logged in');
        return api.card.getCard(user.userId);
      },
      onError: (error) => {
        if (error instanceof Error) {
          showError(error.message);
        }
      },
    });

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

    useEffect(() => {
      if (user?.userId && collection.length === 0) {
        fetchCards();
      }
    }, [user, collection.length, fetchCards]);

    return (
      <>
        {isPending && <CardSkeleton />}
        <div className={style.filterContainer}>
          <SelectFilter cards={collection} id={'set'} setFilterTags={setFilterTags} />
          <SelectFilter cards={collection} id={'types'} setFilterTags={setFilterTags} />
          <SelectFilter cards={collection} id={'rarity'} setFilterTags={setFilterTags} />
          <button onClick={() => setFilterTags({})}>Reset</button>
        </div>

        <div className={style.cardContainer}>
          {filteredData &&
            filteredData
              .slice(
                pagination.pageIndex * pagination.pageSize,
                pagination.pageSize + pagination.pageSize * pagination.pageIndex,
              )
              .map((card) => {
                return (
                  <SearchResults key={`${card.name}${card.set}`} data={card} />
                );
              })}
        </div>

        {filteredData.length === 0 && !isPending && (
          <div className={style.emptyCollection}>
            Your collection is empty. Start adding cards!
          </div>
        )}
        {filteredData.length > 0 && (
          <Pagination table={table} pagination={pagination} />
        )}
      </>
    );
  }
;

export default Collection;
