import { Customer } from "./customer";
import { PaypalAccount } from "./paypal-account";
import { Transaction } from "./transaction";

export class PaymentAccount{
    constructor(
        public id: number,
        public owner: Customer,
        public balance: number,
        public transactions: Transaction[],
        public paypalAccount: PaypalAccount
    ) {
    }
}