import type { IFund } from "../models/fund";

type Props = {
    open: boolean;
    fund: IFund | null;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({ open, fund, onCancel, onConfirm }: Props) {
    if (!open || !fund) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-3">
            <div className="bg-white rounded-lg w-[92%] sm:w-auto max-w-md p-4 sm:p-6 shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold mb-3">Confirmar suscripción</h2>
                <p className="mb-2 text-sm sm:text-base">
                    ¿Estás seguro que deseas suscribirte a{" "}
                    <span className="font-semibold break-words">{fund.name}</span>?
                </p>
                <p className="mb-4 text-sm sm:text-base">
                    Se descontarán{" "}
                    <span className="font-bold text-red-600">
                        ${fund.minAmount.toLocaleString()}
                    </span>{" "}
                    de tu saldo.
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 w-full sm:w-auto">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
