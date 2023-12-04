import { BreakdownItem } from "./breakdown-item";
import { Customer } from "./customer";
import { Invoice } from "./invoice";
import { PaymentAccount } from "./payment-account";

export class Transaction{
    constructor(
        public id: number,
        public transactionDate: Date,
        public total: number,
        public type: string,
        public mode: string,
        public description: string,
        public invoice: Invoice
    ) {
    }
}