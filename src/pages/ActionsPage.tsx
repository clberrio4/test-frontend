import { useState, useMemo, useEffect } from "react";
import { useTransactionsReport } from "../hooks/useReportTrxUser";
import type { ITransactionReport } from "../models/ITransactionReport";
import { formatTimestamp } from "../utils/formatTimestamp";
import { ActiveFilter } from "../components/activeFilter";
import { TransactionsFilter } from "../components/transactionFilter";
import { TransactionsList } from "../components/transactionList";
import { TransactionsTableDesktop } from "../components/transactionTable";
import { Pagination } from "../components/pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { TransactionStatus, type TransactionStatusType } from "../models/enum/transactionStatus";

export default function ActionsPage() {
  const [globalSearch, setGlobalSearch] = useState("");
  const [fundFilter, setFundFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatusType>(TransactionStatus.Todas);
  const [sortDir, setSortDir] = useState<"" | "ASC" | "DES">("ASC");

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
      statusFilter !== TransactionStatus.Todas
        ? statusFilter === TransactionStatus.Activa
          ? "SUBSCRIBE"
          : "UNSUBSCRIBE"
        : undefined,
    order: sortDir || undefined,
  });

  const toggleSort = (column: keyof ITransactionReport, opt: string) => {
    if (column === "fundId") setFundFilter(opt);
    if (column === "customerId") setClientFilter(opt);
  };

  const clearFilters = () => {
    setGlobalSearch("");
    setFundFilter("");
    setClientFilter("");
    setStatusFilter(TransactionStatus.Todas);
    setSortDir("ASC");
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    if (!transactions) return [];
    const q = debouncedGlobal.trim().toLowerCase();
    return transactions.filter((t) => {
      const fundName = (t.fundName || "").toLowerCase();
      const clientName = `${t.firstName} ${t.lastName}`.toLowerCase();
      return !q || fundName.includes(q) || clientName.includes(q);
    });
  }, [transactions, debouncedGlobal]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearch, fundFilter, clientFilter, statusFilter]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.message || "Error al cargar datos"} />;

  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Suscripciones de Clientes</h1>

        <TransactionsFilter
          globalSearch={globalSearch}
          onGlobalSearch={setGlobalSearch}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          sortDir={sortDir}
          onSortDir={setSortDir}
          onClear={clearFilters}
        />

        <ActiveFilter
          fundFilter={fundFilter}
          clientFilter={clientFilter}
          onClearFund={() => setFundFilter("")}
          onClearClient={() => setClientFilter("")}
          resolveFundName={(id) => filtered.find((x) => x.fundId === id)?.fundName || id}
          resolveClientName={(id) => filtered.find((x) => x.customerId === id)?.firstName || id}
        />

        <TransactionsList
          items={paginated}
          onFundClick={(id) => toggleSort("fundId", id)}
          onClientClick={(id) => toggleSort("customerId", id)}
          formatDate={(ts) => formatTimestamp(new Date(ts).getTime())}
        />

        <TransactionsTableDesktop
          items={paginated}
          onFilterClick={setStatusFilter}
          onFundClick={(id) => toggleSort("fundId", id)}
          onClientClick={(id) => toggleSort("customerId", id)}
          formatDate={(ts) => formatTimestamp(new Date(ts).getTime())}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabledPrev={currentPage === 1}
          disabledNext={currentPage === totalPages || totalPages === 0}
        />
      </div>
    </div>
  );
}
