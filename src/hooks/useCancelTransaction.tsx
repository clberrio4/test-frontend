import { useMutation } from "@tanstack/react-query";

const cancelTransaction = async (transactionId: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions/${transactionId}/cancel`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Error al cancelar:", errorBody);
        throw new Error("Error al cancelar la transacción");
    }

    return await res.json();
};

export const useCancelTransaction = () => {
    return useMutation({
        mutationFn: (transactionId: string) => cancelTransaction(transactionId),
    });
};
