import { useLocation, useNavigate } from 'react-router-dom';
import SearchResults from '../../components/searchResults/SearchResults';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import style from './result.module.css';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../../components/pagination/Pagination.tsx';
import api from '../../api/api.service.ts';
import CardSkeleton from '../../components/skeletons/card-skeleton/CardSkeleton.tsx';
import { showError, showInfo } from '../../utils/toastUtils';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  useEffect(() => {
    if (!state) {
      showError("Search term is missing");
      navigate("/home");
      return;
    }
  }, [state, navigate]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["SearchResults", `${state}`],
    staleTime: twentyFourHoursInMs,
    queryFn: async (): Promise<Array<Card>> => {
      try {
        const result = await api.apiCard.getCardByName({ name: state });
        const cards = Array.isArray(result) ? result : result.data || [];
        if (cards.length === 0) {
          showInfo(`No cards found matching "${state}"`);
        }
        return cards;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch cards";
        throw new Error(errorMessage);
      }
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
    return <CardSkeleton />;
  }
  if (error) {
    showError(
      "Search failed",
       error.message
    );
    return (
      <div className={style.errorContainer}>
        <h2>Failed to load results</h2>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={style.globalContainer}>
      <div className={style.resultContainer}>
        {data
          .slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex
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
