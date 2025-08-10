import React from "react";

type Props = {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    disabledPrev?: boolean;
    disabledNext?: boolean;
};

export const Pagination: React.FC<Props> = ({
    currentPage,
    totalPages,
    onPrev,
    onNext,
    disabledPrev,
    disabledNext,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 mt-4">
            <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={onPrev} disabled={disabledPrev}>
                    Anterior
                </button>
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={onNext} disabled={disabledNext}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};
