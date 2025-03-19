import { useCollection } from "../../stores/CollectionStore";
import style from "../../components/setCards/setCards.module.css";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination/Pagination.tsx";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SearchResults from "../../components/searchResults/SearchResults.tsx";
import api from "../../api/api.service.ts";
import { useUser } from "../../stores/UserStore.tsx";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import CardSkeleton from "../../components/skeletons/card-skeleton/CardSkeleton.tsx";

const Collection = () => {
  const { collection } = useCollection();
  const { user } = useUser();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { mutate: fetchCards, isPending } = useMutation({
    mutationFn: async () => {
      if (!user?.userId) throw new Error("User not logged in");
      return api.card.getCard(user.userId);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error("Unable to load your card collection", {
          description: error.message,
          action: {
            label: "Retry",
            onClick: () => {
              fetchCards();
            },
          },
        });
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

      <div className={style.cardContainer}>
        {collection &&
          collection
            .slice(
              pagination.pageIndex * pagination.pageSize,
              pagination.pageSize + pagination.pageSize * pagination.pageIndex
            )
            .map((card) => {
              return (
                <SearchResults key={`${card.name}${card.set}`} data={card} />
              );
            })}
      </div>

      {collection.length === 0 && !isPending && (
        <div className={style.emptyCollection}>
          Your collection is empty. Start adding cards!
        </div>
      )}

      {collection.length > 0 && (
        <Pagination table={table} pagination={pagination} />
      )}
    </>
  );
};

export default Collection;
