import style from './homePage.module.css';
import {useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import type {Set} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {useEffect, useState} from 'react';
import {getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table';
import Pagination from '../../components/pagination/Pagination.tsx';
import api from '../../api/api.service.ts';
import SetSkeleton from '../../components/skeletons/set-Skeleton/SetSkeleton.tsx';
import {showError} from '../../utils/toastUtils.ts';

const HomePage = () => {
    const navigate = useNavigate();
    const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
    const NUMBER_OF_PAGE = 20

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: NUMBER_OF_PAGE,
    });

    const {isPending, error, data, refetch} = useQuery({
        queryKey: ["PokemonSet"],
        queryFn: async (): Promise<Array<Set>> => {
            const result = await api.apiCard.getAllSets();
            return Array.isArray(result) ? result : result.data || [];
        },
        staleTime: twentyFourHoursInMs,
        retry: false,
    });

    useEffect(() => {
        if (error) {
            showError("Unable to retrieve Pokémon card sets", error.message, refetch);
        }
    }, [error, refetch]);

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
        return <SetSkeleton/>;
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
                            <button
                                key={set.id}
                                type="button"
                                className={style.setCard}
                                onClick={() => navigate(`/${set.id}`)}
                            >
                                <img
                                    className={style.setImg}
                                    src={set.images.logo}
                                    alt={`Image of the set ${set.name}`}
                                />
                                <h3 className={style.setName}>{set.name}</h3>
                            </button>
                        );
                    })}
            </div>
            <Pagination table={table} pageKey={"sets"}/>
        </div>
    );
};

export default HomePage;
