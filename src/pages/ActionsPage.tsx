import { useState, useMemo, useEffect } from "react";
import { useTransactionsReport } from "../hooks/useReportTrxUser";
import type { ITransactionReport } from "../models/ITransactionReport";
import { formatTimestamp } from "../utils/formatTimestamp";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function ActionsPage() {
  const [globalSearch, setGlobalSearch] = useState("");
  const [fundFilter, setFundFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [sortDir, setSortDir] = useState<string>("ASC");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [debouncedGlobal, setDebouncedGlobal] = useState(globalSearch);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedGlobal(globalSearch), 250);
    return () => clearTimeout(t);
  }, [globalSearch]);

  const { transactions, isLoading, isError, error } = useTransactionsReport({
    customerId: clientFilter || undefined,
    fundId: fundFilter || undefined,
    status:
      statusFilter !== "Todas"
        ? statusFilter === "Activa"
          ? "SUBSCRIBE"
          : "UNSUBSCRIBE"
        : undefined,
    order: sortDir || undefined,
  });

  const toggleSort = (column: keyof ITransactionReport, opt: string) => {
    switch (column) {
      case "fundId":
        setFundFilter(opt);
        break;
      case "customerId":
        setClientFilter(opt);
        break;
      default:
        break;
    }
  };

  const filtered = useMemo(() => {
    if (!transactions) return [];

    const lowerGlobal = debouncedGlobal.trim().toLowerCase();

    return transactions.filter((t) => {
      const fundName = t.fundName?.toLowerCase() || "";
      const clientName = `${t.firstName} ${t.lastName}`.toLowerCase();

      return (
        !lowerGlobal ||
        fundName.includes(lowerGlobal) ||
        clientName.includes(lowerGlobal)
      );
    });
  }, [transactions, debouncedGlobal]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setGlobalSearch("");
    setFundFilter("");
    setClientFilter("");
    setStatusFilter("Todas");
    setSortDir("ASC");
    setCurrentPage(1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearch, fundFilter, clientFilter, statusFilter]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.message || "Error al cargar datos"} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Suscripciones de Clientes</h1>

        {/* Primera fila: inputs + selects + limpiar filtros */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="relative flex-grow min-w-[220px]">
            <input
              type="text"
              placeholder="Buscar (fondo o cliente)"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              spellCheck={false}
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda global"
              >
                ✕
              </button>
            )}
          </div>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 w-40 flex-shrink-0"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todas">Todas</option>
            <option value="Activa">Activas</option>
            <option value="Cancelada">Canceladas</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 w-40 flex-shrink-0"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value === "" ? "DES" : e.target.value)}
            aria-label="Ordenar por fecha"
          >
            <option value="">Ordenar Por Fecha</option>
            <option value="ASC">ASCENDENTE</option>
            <option value="DES">DESCENDENTE</option>
          </select>

          <button
            className="ml-auto bg-orange-200 px-4 py-2 rounded-lg hover:bg-orange-300 whitespace-nowrap flex-shrink-0"
            type="button"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        </div>

        {/* Segunda fila: botones de filtros activos */}
        <div className="flex flex-wrap gap-4 mb-6">
          {fundFilter && (
            <button
              type="button"
              onClick={() => setFundFilter("")}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 whitespace-nowrap"
            >
              {filtered.find((item) => item.fundId === fundFilter)?.fundName || fundFilter} &times;
            </button>
          )}

          {clientFilter && (
            <button
              type="button"
              onClick={() => setClientFilter("")}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 whitespace-nowrap"
            >
              {filtered.find((item) => item.customerId === clientFilter)?.firstName || clientFilter} &times;
            </button>
          )}
        </div>

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
                {paginated.map((t) => (
                  <tr key={t.transactionId} className="border-t border-gray-200">
                    <td
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => toggleSort("fundId", t.fundId)}
                    >
                      {t.fundName}
                    </td>
                    <td
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => toggleSort("customerId", t.customerId)}
                    >
                      {t.firstName} {t.lastName}
                    </td>
                    <td className="px-4 py-2">{formatTimestamp(t.createdAt)}</td>
                    <td className="px-4 py-2">
                      {t.status === "SUBSCRIBE" ? "Activa" : "Cancelada"}
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
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

        {/* Paginación */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
