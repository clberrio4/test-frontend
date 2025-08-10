import React from "react";

type Props = {
    globalSearch: string;
    onGlobalSearch: (v: string) => void;
    statusFilter: "Todas" | "Activa" | "Cancelada";
    onStatusFilter: (v: "Todas" | "Activa" | "Cancelada") => void;
    sortDir: "" | "ASC" | "DES";
    onSortDir: (v: "" | "ASC" | "DES") => void;
    onClear: () => void;
};

export const TransactionsFilter: React.FC<Props> = ({
    globalSearch,
    onGlobalSearch,
    statusFilter,
    onStatusFilter,
    sortDir,
    onSortDir,
    onClear,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4">
            <div className="relative flex-1 min-w-[220px]">
                <input
                    type="text"
                    placeholder="Buscar (fondo o cliente)"
                    className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full pr-9 sm:pr-10"
                    value={globalSearch}
                    onChange={(e) => onGlobalSearch(e.target.value)}
                    spellCheck={false}
                />
                {globalSearch && (
                    <button
                        type="button"
                        onClick={() => onGlobalSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Limpiar búsqueda global"
                    >
                        ✕
                    </button>
                )}
            </div>

            <select
                className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-40"
                value={statusFilter}
                onChange={(e) => onStatusFilter(e.target.value as Props["statusFilter"])}
                aria-label="Filtrar por estado"
            >
                <option value="Todas">Todas</option>
                <option value="Activa">Activas</option>
                <option value="Cancelada">Canceladas</option>
            </select>

            <select
                className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-44"
                value={sortDir}
                onChange={(e) => onSortDir((e.target.value || "") as Props["sortDir"])}
                aria-label="Ordenar por fecha"
            >
                <option value="">Ordenar Por Fecha</option>
                <option value="ASC">ASCENDENTE</option>
                <option value="DES">DESCENDENTE</option>
            </select>

            <button
                className="sm:ml-auto bg-orange-200 px-4 py-2 rounded-lg hover:bg-orange-300 whitespace-nowrap"
                type="button"
                onClick={onClear}
            >
                Limpiar filtros
            </button>
        </div>
    );
};
