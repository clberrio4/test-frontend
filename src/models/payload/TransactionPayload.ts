export interface TransactionPayload {
    customerId: string;
    fundId: string;
    status: 'SUBSCRIBE' | 'UNSUBSCRIBE';
}