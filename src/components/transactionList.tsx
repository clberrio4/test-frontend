import React from "react";
import type { ITransactionReport } from "../models/ITransactionReport";

type Props = {
  items: ITransactionReport[];
  onFundClick: (fundId: string) => void;
  onClientClick: (clientId: string) => void;
  formatDate: (ts: string | number | Date) => string;
};

export const TransactionsList: React.FC<Props> = ({
  items,
  onFundClick,
  onClientClick,
  formatDate,
}) => {
  return (
    <div className="md:hidden space-y-3">
      {items.length === 0 && (
        <div className="text-center py-4 text-gray-500">No se encontraron resultados.</div>
      )}

      {items.map((t) => (
        <div key={t.transactionId} className="border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between gap-3">
            <div className="font-semibold">{t.fundName}</div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                t.status === "SUBSCRIBE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {t.status === "SUBSCRIBE" ? "Activa" : "Cancelada"}
            </span>
          </div>
          <div className="text-gray-700 mt-1">{t.firstName} {t.lastName}</div>
          <div className="text-gray-500 text-sm mt-1">{formatDate(t.createdAt)}</div>

          <div className="flex gap-2 mt-2">
            <button className="text-blue-600 text-sm underline" onClick={() => onFundClick(t.fundId)}>
              Ver más de este fondo
            </button>
            <button className="text-blue-600 text-sm underline" onClick={() => onClientClick(t.customerId)}>
              Ver más de este cliente
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
