import {Table} from '@tanstack/react-table';
import type {Set} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {CollectionCard} from '../../types/card.types';
import {useEffect} from 'react';

const Pagination = ({table, pageKey = 'default'}
                    :
                    {
                        table: Table<CollectionCard> | Table<Set>,
                        pageKey?: string
                    }
) => {

    useEffect(() => {
        const savedPage = localStorage.getItem(`tablePage_${pageKey}`);
        if (savedPage !== null) {
            const pageNumber = parseInt((savedPage), 10);
            if (pageNumber > 0) {
                table.setPageIndex(pageNumber)
            }
        }
    }, []);

    const pageCount = table.getPageCount();

    const handleIncrementPage = (action: () => void) => {
        action();

        const newPageIndex = table.getState().pagination.pageIndex;
        table.setPageIndex(Number(newPageIndex) + 1)
        localStorage.setItem(`tablePage_${pageKey}`, (newPageIndex + 1).toString())
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleDecrementPage = (action: () => void) => {
        action();

        const newPageIndex = table.getState().pagination.pageIndex;
        table.setPageIndex(Number(newPageIndex) - 1)
        localStorage.setItem(`tablePage_${pageKey}`, (newPageIndex - 1).toString())
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleFirstPage = () => {
        table.firstPage();
        localStorage.setItem(`tablePage_${pageKey}`, '1')
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const handleLastPage = () => {
        table.lastPage();
        localStorage.setItem(`tablePage_${pageKey}`, pageCount.toString());
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
            onClick={() => handleDecrementPage(() => {
                table.previousPage()
            })}
            disabled={!table.getCanPreviousPage()}
        >
            {"<"}
        </button>
        <div className="pageInformation">{table.getState().pagination.pageIndex + 1}</div>

        <button
            onClick={() => handleIncrementPage(() => {
                table.nextPage()
            })}
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