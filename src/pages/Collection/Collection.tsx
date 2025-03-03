import { useCollection } from '../../services/stores/CollectionStore';
import style from '../../components/setCards/setCards.module.css';
import SearchResults from '../../components/SearchResults/SearchResults.tsx';
import { useEffect, useState } from 'react';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useUser } from '../../services/stores/UserStore.tsx';


const Collection = () => {
  const { collection,fillCollection} = useCollection();
  const {getUser} = useUser();

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
  });

  const table = useReactTable({
    columns: [],
    data: collection ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      //...
      pagination
    }});

  const currentUser = getUser()
  
  useEffect(() => {
    if (currentUser?.userId && collection.length == 0 ) {
      fillCollection(currentUser.userId);
    }
  }, [currentUser, fillCollection,collection.length]);



  return (
    <>
      <div className={style.cardContainer}>
        {collection &&
          collection.slice(
            pagination.pageIndex * pagination.pageSize,
            pagination.pageSize + pagination.pageSize * pagination.pageIndex
          ).map((card) => {
            return (
              <SearchResults key={card.id} data={card} />
            );
          })
        }
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
    </>
  );
};

export default Collection;
