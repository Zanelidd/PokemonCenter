import style from './homePage.module.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import loadingGif from '/ピカチュウ-pokeball.gif';
import type { Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { useState } from 'react';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

const HomePage = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const { isPending, error, data } = useQuery({
    queryKey: ["PokemonSet"],
    queryFn: async ():Promise<Array<Set>> => {
     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/external_api`,
         {method: "GET", headers: {
           "Content-Type": "application/json",
           }})

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      return Array.isArray(result) ? result :result.data || [];

    },
    staleTime: twentyFourHoursInMs,
  });

  const table = useReactTable({
    columns: [],
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  if (isPending) {
    return <img className="loadingGif" src={loadingGif} alt="Loading Gif" />;
  }

  if (error) {
    return "An error occurred: " + error.message;
  }

  return (
    <div className={style.containerHome}>
      <div className={style.setContainer}>
        {data
          ?.slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex
          )
          .map((set) => {
            return (
              <div
                key={set.id}
                className={style.setCard}
                onClick={() => {
                  navigate(`/${set.id}`);
                }}
              >
                <img className={style.setImg} src={set.images.logo} alt={`Image of the set ${set.name}`} />
                <h3 className={style.setName}>{set.name}</h3>
              </div>
            );
          })}
      </div>
      <div className="paginationContainer">
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
    </div>
  );
};

export default HomePage;
