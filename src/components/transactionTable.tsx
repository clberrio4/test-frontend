import React from "react";
import type { ITransactionReport } from "../models/ITransactionReport";
import { TransactionStatus, type TransactionStatusType } from "../models/enum/transactionStatus";

type Props = {
    items: ITransactionReport[];
    onFundClick: (fundId: string) => void;
    onClientClick: (clientId: string) => void;
    onFilterClick: (opt: TransactionStatusType) => void;
    formatDate: (ts: string | number | Date) => string;
};

export const TransactionsTableDesktop: React.FC<Props> = ({
    items,
    onFundClick,
    onClientClick,
    onFilterClick,
    formatDate,
}) => {
    const mapReportStatusToFilter = (s: ITransactionReport["status"]): TransactionStatusType =>
        s === "SUBSCRIBE" ? TransactionStatus.Activa : TransactionStatus.Cancelada;

    return (
        <div className="hidden md:block">
            <div className="overflow-x-auto">
                <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-700 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Fondo</th>
                                <th className="px-4 py-2">Cliente</th>
                                <th className="px-4 py-2">Solicitud</th>
                                <th className="px-4 py-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((t) => (
                                <tr key={t.transactionId} className="border-t border-gray-200">
                                    <td className="px-4 py-2 cursor-pointer" onClick={() => onFundClick(t.fundId)}>
                                        {t.fundName}
                                    </td>
                                    <td className="px-4 py-2 cursor-pointer" onClick={() => onClientClick(t.customerId)}>
                                        {t.firstName} {t.lastName}
                                    </td>
                                    <td className="px-4 py-2">{formatDate(t.createdAt)}</td>
                                    <td
                                        className="px-4 py-2 cursor-pointer"
                                        onClick={() => onFilterClick(mapReportStatusToFilter(t.status))}
                                    >
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${t.status === "SUBSCRIBE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {t.status === "SUBSCRIBE" ? "Activa" : "Cancelada"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-500">
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
