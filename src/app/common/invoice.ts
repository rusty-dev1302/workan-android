import { BreakdownItem } from "./breakdown-item";

export class Invoice {
    constructor(
        public id: number,
        public fromName: string,
        public toName: string,
        public fromAddress: string,
        public toAddress: string,
        public totalAmount: number,
        public dateCreated: Date,
        public paid: boolean,
        public breakdown: BreakdownItem[]
    ) {
    }
}
