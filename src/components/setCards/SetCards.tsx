import { useNavigate, useParams } from 'react-router-dom';
import style from './setCards.module.css';
import { useQuery } from '@tanstack/react-query';
import loadingGif from '/ピカチュウ-pokeball.gif';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import Pagination from '../pagination/Pagination.tsx';
import api from '../../api/api.service.ts';

const SetCards = () => {
  const navigate = useNavigate();
  const params = useParams();
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
  const { isPending, error, data } = useQuery({
    queryKey: ['SetCard', `${params.setId}`],
    queryFn: async (): Promise<Array<Card>> => {
      if (params.setId) {
        const response = await api.apiCard.getCardBySet(params.setId);
        return Array.isArray(response) ? response : response.data;
      }
      return [];
    },
    staleTime: twentyFourHoursInMs,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    columns: [],
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, state: {
      //...
      pagination,
    },
  });

  if (isPending) {
    return <img className="loadingGif" src={loadingGif} alt="Loading Gif" />;
  }

  if (error) {
    return 'An error occured: ' + error.message;
  }

  return (
    < >
      <div className={style.cardContainer}>
        {data
          .slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex,
          )
          .map((card: Card) => {
            return (
              <img
                className={style.card}
                key={card.id}
                onClick={() => {
                  navigate(`/card/${card.id}`);
                }}
                src={card.images.small}
                alt={`image of ${card.name}`}
              />
            );
          })}
      </div>
      <Pagination table={table} pagination={pagination} />
    </>
  );
};

export default SetCards;
