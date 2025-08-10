import type { IFund } from "../models/fund";

type Props = {
  fund: IFund;
  isSubscribed: boolean;
  insufficient: boolean;
  transactionId?: string;
  onSubscribe: (fund: IFund) => void;
  onCancel: (transactionId: string, fundId: string) => void;
};

export default function FundItem({
  fund, isSubscribed, insufficient, transactionId, onSubscribe, onCancel
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border rounded-lg p-3 sm:p-4 shadow-sm bg-white">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-semibold break-words">{fund.name}</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Monto mínimo: ${fund.minAmount.toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
        {!isSubscribed ? (
          <button
            disabled={insufficient}
            onClick={() => onSubscribe(fund)}
            className={`px-4 py-2 rounded text-white transition w-full sm:w-auto ${
              insufficient ? "bg-red-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {insufficient ? "Sin saldo" : "Suscribirme"}
          </button>
        ) : (
          <button
            onClick={() => transactionId && onCancel(transactionId, fund.id)}
            className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600 w-full sm:w-auto"
          >
            Cancelar suscripción
          </button>
        )}
      </div>
    </div>
  );
}
