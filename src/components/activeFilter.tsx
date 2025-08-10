import React from "react";

type Props = {
    fundFilter: string;
    clientFilter: string;
    onClearFund: () => void;
    onClearClient: () => void;
    resolveFundName: (id: string) => string;
    resolveClientName: (id: string) => string;
};

export const ActiveFilter: React.FC<Props> = ({
    fundFilter,
    clientFilter,
    onClearFund,
    onClearClient,
    resolveFundName,
    resolveClientName,
}) => {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            {fundFilter && (
                <button
                    type="button"
                    onClick={onClearFund}
                    className="bg-red-100 text-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-200 whitespace-nowrap text-sm"
                >
                    {resolveFundName(fundFilter)} &times;
                </button>
            )}
            {clientFilter && (
                <button
                    type="button"
                    onClick={onClearClient}
                    className="bg-red-100 text-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-200 whitespace-nowrap text-sm"
                >
                    {resolveClientName(clientFilter)} &times;
                </button>
            )}
        </div>
    );
};
