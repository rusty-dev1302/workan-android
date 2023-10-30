import { BreakdownItem } from "./breakdown-item";
import { Customer } from "./customer";
import { PaymentAccount } from "./payment-account";

export class Transaction{
    constructor(
        public id: number,
        public transactionDate: Date,
        public total: number,
        public type: string,
        public mode: string,
        public otherParty: Customer,
        public breakdown: BreakdownItem[],
        public account: PaymentAccount
    ) {
    }
}