import { useQuery } from '@tanstack/react-query';
import type { ITransactionReport } from '../models/ITransactionReport';

interface FetchParams {
    customerId?: string;
    fundId?: string;
    status?: string;
    order?: string;
}

const fetchTransactions = async (params: FetchParams): Promise<ITransactionReport[]> => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/transactions/filter`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, value);
        }
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener las transacciones');

    const json = await res.json();
    return json.data;
};

export const useTransactionsReport = (params: FetchParams) => {
    const query = useQuery<ITransactionReport[], Error>({
        queryKey: ['transactions', params], // react-query refresca al cambiar params
        queryFn: () => fetchTransactions(params),
        enabled: true, // siempre ejecuta (pero con params dinámicos)
    });

    return {
        transactions: query.data ?? [],
        ...query,
    };
};