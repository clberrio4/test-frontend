export const TransactionStatus = {
    Todas: "Todas",
    Activa: "Activa",
    Cancelada: "Cancelada",
} as const;

export type TransactionStatusType =
    (typeof TransactionStatus)[keyof typeof TransactionStatus];