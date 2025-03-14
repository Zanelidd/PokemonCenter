import { useNavigate, useParams } from 'react-router-dom';
import style from './setCards.module.css';
import { useQuery } from '@tanstack/react-query';
import loadingGif from '/ピカチュウ-pokeball.gif';
import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

const SetCards = () => {
  const navigate = useNavigate();
  const params = useParams();

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
  const { isPending, error, data } = useQuery({
    queryKey: ["SetCard", `${params.setId}`],
    queryFn: async ():Promise<Array<Card>> => {
      const response =
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/external_api/cards`,
        {method : "POST",
         headers:{
          "Content-Type": "application/json",
          },
        body : JSON.stringify({ setId:params.setId}),
        },)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      return Array.isArray(result) ? result :result.data || [];

    },
    staleTime: twentyFourHoursInMs,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
  });

  const table = useReactTable({
    columns: [],
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      //...
      pagination,
    },
  });

  if (isPending) {
    return <img className="loadingGif" src={loadingGif} alt="Loading Gif" />;
  }

  if (error) {
    return "An error occured: " + error.message;
  }

  return (
    < >
      <div className={style.cardContainer}>
        {data
          .slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex
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
      <div  className="paginationContainer">
        <button
          className="fastBackwardButton"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <div className="pageInformation">{pagination.pageIndex + 1}</div>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="fastForwardButton"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <select
          className="selectPage"
          id="selectPage"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SetCards;
