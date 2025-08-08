import { useQuery } from "@tanstack/react-query";
import type { ITransaction } from "../models/transacton";

type ResponseData = {
    data: ITransaction[];
};

const fetchClientTransactions = async (customerId: string): Promise<ITransaction[]> => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions/customer/${customerId}`
    );

    if (!response.ok) {
        throw new Error("Error al obtener las transacciones del cliente");
    }

    const json: ResponseData = await response.json();
    return json.data;
};

export const useClientTransactions = (customerId: string) => {
    return useQuery({
        queryKey: ["transactions", customerId],
        queryFn: () => fetchClientTransactions(customerId),
        enabled: !!customerId,
    });
};