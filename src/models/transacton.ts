export interface ITransaction {
    id: string;
    customerId: string;
    fundId: string;
    status: "SUBSCRIBE" | "UNSUBSCRIBE";
    performedBy: string | null;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
};