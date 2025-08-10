import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IFund } from "../models/fund";
import { useFunds } from "../hooks/useFunds";
import { useClientById } from "../hooks/useClientById";
import { useCreateTransaction } from "../hooks/useSubscribeToFund";
import { useQueryClient } from "@tanstack/react-query";
import { useCancelTransaction } from "../hooks/useCancelTransaction";
import { useClientTransactions } from "../hooks/useClientTransactions";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import BalanceHeader from "../components/balanceHeader";
import FundsList from "../components/fundsList";
import ConfirmModal from "../components/confirmModal";

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
        if (data) setBalance(data.balance);
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

            queryClient.setQueryData(["client", id], (oldData: any) => {
                if (!oldData) return oldData;
                return { ...oldData, balance: oldData.balance - selectedFund.minAmount };
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
                setBalance((prev) => prev + data.amount);
                setSubscribedIds((prev) => prev.filter((x) => x !== fundId));
                setTransactionMap((prev) => {
                    const copy = { ...prev };
                    delete copy[fundId];
                    return copy;
                });
            },
            onError: () => alert("Error al cancelar la suscripción"),
        });
    };

    if (isLoading || loadingUser || isLoadingTrx) return <LoadingSpinner />;
    if (isError || isErrorUser)
        return <ErrorMessage message={error?.message || "No se pudo cargar la información del usuario"} />;

    return (
        <div className="h-full overflow-y-auto bg-gray-100">
            <div className="lg:min-h-full lg:flex lg:items-center lg:justify-center">
                <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-6">
                    <BalanceHeader name={data!.name} lastname={data!.lastname} balance={balance} />

                    <FundsList
                        funds={funds}
                        balance={balance}
                        subscribedIds={subscribedIds}
                        transactionMap={transactionMap}
                        onSubscribe={handleSubscribeClick}
                        onCancel={handleCancel}
                    />
                </div>
            </div>

            <ConfirmModal
                open={isConfirming}
                fund={selectedFund}
                onCancel={() => setIsConfirming(false)}
                onConfirm={confirmSubscription}
            />
        </div>
    );
}
