import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IFund } from "../models/fund";
import { useFunds } from "../hooks/useFunds";
import { useClientById } from "../hooks/useClientById";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useCreateTransaction } from "../hooks/useSubscribeToFund";
import { useQueryClient } from "@tanstack/react-query";
import { useCancelTransaction } from "../hooks/useCancelTransaction";
import { useClientTransactions } from "../hooks/useClientTransactions";

export default function UserActionPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { funds, isLoading, isError, error } = useFunds();
    const { data, isLoading: loadingUser, isError: isErrorUser } = useClientById(id!);
    const { data: transactions, refetch: refetchTrx, isLoading: isLoadingTrx } = useClientTransactions(id!);

    const [balance, setBalance] = useState(0);
    const [selectedFund, setSelectedFund] = useState<IFund | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [subscribedIds, setSubscribedIds] = useState<string[]>([]);
    const [transactionMap, setTransactionMap] = useState<Record<string, string>>({});

    const { mutateAsync: subscribeTransaction } = useCreateTransaction();
    const { mutate: cancelTransaction } = useCancelTransaction();

    useEffect(() => {
        if (data) {
            setBalance(data.balance);
        }
    }, [data]);

    useEffect(() => {
        if (transactions) {
            const activeSubs = transactions
                .filter((t) => t.status === "SUBSCRIBE")
                .reduce<Record<string, string>>((acc, t) => {
                    acc[t.fundId] = t.id;
                    return acc;
                }, {});
            setSubscribedIds(Object.keys(activeSubs));
            setTransactionMap(activeSubs);
        }
    }, [transactions]);

    const handleSubscribeClick = (fund: IFund) => {
        setSelectedFund(fund);
        setIsConfirming(true);
    };

    const confirmSubscription = async () => {
        if (!selectedFund || !id) return;

        if (selectedFund.minAmount > balance) {
            alert("No tienes saldo suficiente.");
            setIsConfirming(false);
            return;
        }

        try {
            await subscribeTransaction({
                fundId: selectedFund.id,
                customerId: id,
                status: "SUBSCRIBE",
            });

            setBalance((prev) => prev - selectedFund.minAmount);
            setSubscribedIds((prev) => [...prev, selectedFund.id]);

            queryClient.setQueryData(['client', id], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    balance: oldData.balance - selectedFund.minAmount,
                };
            });
            refetchTrx();
        } catch {
            alert("Error al suscribirse al fondo.");
        } finally {
            setIsConfirming(false);
            setSelectedFund(null);
        }
    };

    const handleCancel = (transactionId: string, fundId: string) => {

        cancelTransaction(transactionId, {
            onSuccess: ({ data }) => {
                setBalance(prev => prev + data.amount);

                setSubscribedIds(prev => prev.filter(id => id !== fundId));

                setTransactionMap(prev => {
                    const copy = { ...prev };
                    delete copy[fundId];
                    return copy;
                });

            },
            onError: (error: any) => {
                console.error("Error al cancelar:", error);
                alert("Error al cancelar la suscripción");
            },
        });
    };


    if (isLoading || loadingUser || isLoadingTrx) {
        return <LoadingSpinner />;
    }

    if (isError || isErrorUser) {
        return <ErrorMessage message={error?.message || "No se pudo cargar la información del usuario"} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h1 className="text-2xl font-bold text-black-600 text-center pb-2">
                    Hola <span className="text-2xl font-bold text-blue-600 text-center pb-2">{data!.name} {data!.lastname}</span>, deseas abrir un fondo
                </h1>

                <h3 className="mb-6 text-gray-700 text-center">
                    Monto disponible:
                    <span
                        className={`font-semibold ml-1 ${balance >= 400000
                            ? "text-green-600"
                            : balance >= 100000
                                ? "text-yellow-500"
                                : "text-red-600"
                            }`}
                    >
                        ${balance.toLocaleString()}
                    </span>
                </h3>

                <div className="space-y-4">
                    {funds.map((fund) => {
                        const isSubscribed = subscribedIds.includes(fund.id);
                        const insufficient = fund.minAmount > balance;
                        const transactionId = transactionMap[fund.id];
                        return (
                            <div
                                key={`${fund.id}-${isSubscribed ? 'subscribed' : 'available'}`}
                                className="flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{fund.name}</h2>
                                    <p className="text-gray-600">
                                        Monto mínimo: ${fund.minAmount.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!isSubscribed ? (
                                        <button
                                            disabled={insufficient}
                                            onClick={() => handleSubscribeClick(fund)}
                                            className={`px-4 py-2 rounded text-white transition duration-300 ease-in-out ${insufficient
                                                ? "bg-red-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            {insufficient ? "Sin saldo" : "Suscribirme"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCancel(transactionId, fund.id)}
                                            className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600"
                                        >
                                            Cancelar suscripción
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isConfirming && selectedFund && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 text-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirmar suscripción</h2>
                        <p className="mb-2">
                            ¿Estás seguro que deseas suscribirte a{" "}
                            <span className="font-semibold">{selectedFund.name}</span>?
                        </p>
                        <p className="mb-4">
                            Se descontarán{" "}
                            <span className="font-bold text-red-600">
                                ${selectedFund.minAmount.toLocaleString()}
                            </span>{" "}
                            de tu saldo.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirming(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmSubscription}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
