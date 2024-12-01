import { useLocation } from "react-router-dom";
import SearchResults from "../../components/SearchResults/SearchResults";
import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import style from "./result.module.css";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import loadingGif from "/ピカチュウ-pokeball.gif";

const Results = () => {
  const location = useLocation();
  const state = location.state;
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["SearchResults", `${state}`],
    staleTime: twentyFourHoursInMs,
    queryFn: async () :Promise<Array<Card>> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/external_api`,
      {method : "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body : JSON.stringify({ name : state }),},
      )
      if (!response.ok) {
        throw new Error("Could not find any result");
      }
      const result = await response.json();
      return Array.isArray(result) ? result :result.data || [];
    }})


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
    return <img className="loadingGif" src={loadingGif} alt="Loading Gif" />;
  }

  if (error) {
    return "An error occured: " + error.message;
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

export default Results;
