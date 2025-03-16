import { useCollection } from '../../stores/CollectionStore';
import style from '../../components/setCards/setCards.module.css';
import { useEffect, useState } from 'react';
import Pagination from '../../components/pagination/Pagination.tsx';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import SearchResults from '../../components/searchResults/SearchResults.tsx';
import api from '../../api/api.service.ts';
import { useUser } from '../../stores/UserStore.tsx';


const Collection = () => {
  const { collection } = useCollection();

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
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

  const { user } = useUser();

  useEffect(() => {
    if (user?.userId && collection.length == 0) {
      api.card.getCard(user.userId)
        .then(() => console.log('card Added'));
    }
  }, [user, collection.length]);
  
  return (
    <>
      <div className={style.cardContainer}>
        {collection &&
          collection.slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex,
          ).map((card) => {
            return (
              <SearchResults key={`${card.name}${card.set}`} data={card} />
            );
          })
        }
      </div>
      <Pagination table={table} pagination={pagination} />
    </>
  );
};

export default Collection;


