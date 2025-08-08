import { useQuery } from '@tanstack/react-query';
import type { IUser } from '../models/user';

const fetchClients = async (): Promise<IUser[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients`);
    if (!res.ok) throw new Error("Error al obtener clientes");

    const rowData = await res.json();

    return rowData.data.map((client: any, i: number) => ({
        ...client,
        avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    }));
};

export const useClients = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<IUser[], Error>({
        queryKey: ['clients'],
        queryFn: fetchClients,
    });

    return {
        clients: data,
        isLoading,
        isError,
        error,
        refetch,
    };
};
