import style from "./homePage.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../components/pagination/Pagination.tsx";
import api from "../../api/api.service.ts";
import SetSkeleton from "../../components/skeletons/set-Skeleton/SetSkeleton.tsx";
import { showError } from "../../utils/toastUtils.ts";

const HomePage = () => {
  const navigate = useNavigate();
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { isPending, data, refetch } = useQuery({
    queryKey: ["PokemonSet"],
    queryFn: async (): Promise<Array<Set>> => {
      try {
        const result = await api.apiCard.getAllSets();
        return Array.isArray(result) ? result : result.data || [];
      } catch (error) {
        if (error instanceof Error) {
          showError(
            "Unable to retrieve Pokémon card sets",
            "0 set found",
            refetch
          );
        }
        throw error;
      }
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
    return <SetSkeleton />;
  }

  if (!data) {
    return null;
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
                <img
                  className={style.setImg}
                  src={set.images.logo}
                  alt={`Image of the set ${set.name}`}
                />
                <h3 className={style.setName}>{set.name}</h3>
              </div>
            );
          })}
      </div>
      <Pagination table={table} pagination={pagination} />
    </div>
  );
};

export default HomePage;
