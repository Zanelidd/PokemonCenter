import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import style from "./homePage.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import loadingGif from "/ピカチュウ-pokeball.gif";
import { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const HomePage = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const { isPending, error, data } = useQuery({
    queryKey: ["PokemonSet"],
    queryFn: () => {
      return PokemonTCG.getAllSets();
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
    return "An error occured: " + error.message;
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
                <h3 className={style.setName}>{set.name}</h3>
                <img className={style.setImg} src={set.images.logo} />
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
