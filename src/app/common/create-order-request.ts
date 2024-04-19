import { Customer } from "./customer";

export class CreateOrderRequest {
    constructor(
        public customer: Customer,
        public listingId: number,
        public preferredStartTimeHhmm: number,
        public preferredEndTimeHhmm: number,
        public appointmentDate: Date,
        public menuItems: any[],
        public duration: string
    ) {
    }
}