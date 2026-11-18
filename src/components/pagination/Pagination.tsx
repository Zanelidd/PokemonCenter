import {Table} from '@tanstack/react-table';
import type {Set} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {CollectionCard} from '../../types/card.types';
import {useEffect, useRef} from 'react';

const Pagination = ({table, pageKey = 'default'}
                    :
                    {
                        table: Table<CollectionCard> | Table<Set>,
                        pageKey?: string
                    }
) => {

    const restored = useRef(false);
    useEffect(() => {
        if (restored.current) return;
        const savedPage = localStorage.getItem(`tablePage_${pageKey}`);
        if (savedPage !== null) {
            const pageNumber = parseInt(savedPage, 10);
            if (pageNumber >= 0) {
                table.setPageIndex(pageNumber);
            }
        }
        restored.current = true;
    }, [pageKey, table]);

    const pageCount = table.getPageCount();

    const handleIncrementPage = () => {
        const newPageIndex = table.getState().pagination.pageIndex + 1;
        table.setPageIndex(newPageIndex);
        localStorage.setItem(`tablePage_${pageKey}`, newPageIndex.toString());
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleDecrementPage = () => {
        const newPageIndex = table.getState().pagination.pageIndex - 1;
        table.setPageIndex(newPageIndex);
        localStorage.setItem(`tablePage_${pageKey}`, newPageIndex.toString());
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleFirstPage = () => {
        table.firstPage();
        localStorage.setItem(`tablePage_${pageKey}`, '0');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleLastPage = () => {
        table.lastPage();
        localStorage.setItem(`tablePage_${pageKey}`, (pageCount - 1).toString());
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return <div className="paginationContainer">
        <button
            className="fastBackwardButton"
            onClick={() => handleFirstPage()}
            disabled={!table.getCanPreviousPage()}
        >
            {"<<"}
        </button>
        <button
            onClick={() => handleDecrementPage()}
            disabled={!table.getCanPreviousPage()}
        >
            {"<"}
        </button>
        <div className="pageInformation">{table.getState().pagination.pageIndex + 1}</div>

        <button
            onClick={() => handleIncrementPage()}
            disabled={!table.getCanNextPage()}
        >
            {">"}
        </button>
        <button
            className="fastForwardButton"
            onClick={() => handleLastPage()}
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
