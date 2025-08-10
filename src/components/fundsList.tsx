import type { IFund } from "../models/fund";
import FundItem from "./fundItem";

type Props = {
    funds: IFund[];
    balance: number;
    subscribedIds: string[];
    transactionMap: Record<string, string>;
    onSubscribe: (fund: IFund) => void;
    onCancel: (transactionId: string, fundId: string) => void;
};

export default function FundsList({
    funds, balance, subscribedIds, transactionMap, onSubscribe, onCancel
}: Props) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {funds.map((fund) => {
                const isSubscribed = subscribedIds.includes(fund.id);
                const insufficient = fund.minAmount > balance;
                const transactionId = transactionMap[fund.id];

                return (
                    <FundItem
                        key={`${fund.id}-${isSubscribed ? "subscribed" : "available"}`}
                        fund={fund}
                        isSubscribed={isSubscribed}
                        insufficient={insufficient}
                        transactionId={transactionId}
                        onSubscribe={onSubscribe}
                        onCancel={onCancel}
                    />
                );
            })}
        </div>
    );
}
