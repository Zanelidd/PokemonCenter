import { useLocation } from 'react-router-dom';
import SearchResults from '../../components/searchResults/SearchResults';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import style from './result.module.css';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../../components/pagination/Pagination.tsx';
import api from '../../api/api.service.ts';
import CardSkeleton from '../../components/skeletons/card-skeleton/CardSkeleton.tsx';

const Results = () => {
  const location = useLocation();
  const state = location.state;
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['SearchResults', `${state}`],
    staleTime: twentyFourHoursInMs,
    queryFn: async (): Promise<Array<Card>> => {
      const result = await api.apiCard.getCardByName({ name: state });
      return Array.isArray(result) ? result : result.data || [];
    },
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
return <CardSkeleton/>
  }

  if (error) {
    return 'An error occured: ' + error.message;
  }

  return (
    <div className={style.globalContainer}>
      <div className={style.resultContainer}>
        {data
          .slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex,
          )
          .map((stat: Card) => {
            return <SearchResults key={stat.id} data={stat} />;
          })}
      </div>
      <Pagination table={table} pagination={pagination} />
    </div>
  );
};

export default Results;
