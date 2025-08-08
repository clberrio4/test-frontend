export interface ITransactionReport {
    transactionId: string;
    customerId: string;
    firstName: string;
    lastName: string;
    fundId: string;
    fundName: string;
    status: 'SUBSCRIBE' | 'UNSUBSCRIBE';
    amount: number;
    createdAt: number;
    updatedAt: number;
}