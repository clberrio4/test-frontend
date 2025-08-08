import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TransactionPayload } from '../models/payload/TransactionPayload';



export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, TransactionPayload>({
        mutationFn: async ({ customerId, fundId, status }) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        customerId,
                        fundId,
                        status,
                    },
                }),
            });

            if (!res.ok) {
                const errorBody = await res.json();
                console.error("Detalle del error:", errorBody);
                throw new Error("Error al crear la transacción");
            }
        },
        onSuccess: (_, { customerId }) => {
            queryClient.invalidateQueries({ queryKey: ['client', customerId] });
        },
    });
};
