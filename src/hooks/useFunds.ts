import { useQuery } from '@tanstack/react-query';
import type { IFund } from '../models/fund';

const fetchFunds = async (): Promise<IFund[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/funds`);
    if (!res.ok) {
        throw new Error('Error al obtener los fondos');
    }
    const json = await res.json();
    return json.data;
};

export const useFunds = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<IFund[], Error>({
        queryKey: ['funds'],
        queryFn: fetchFunds,
    });

    return {
        funds: data ?? [],
        isLoading,
        isError,
        error,
        refetch,
    };
};
