import { Table } from '@tanstack/react-table';
import { CollectionCard } from '../../services/types.ts';
import type { Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';

const Pagination =(  { table, pagination }
 :
{
  table : Table<CollectionCard> | Table<Set>,
    pagination : {pageIndex: number, pageSize: number}
  }
)=>{
  return   <div className="paginationContainer">
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

}

export default Pagination;