import { Customer } from "./customer";

export class CreateOrderRequest {
    constructor(
        public customer: Customer,
        public slotTemplateItemId: number,
        public appointmentDate: Date,
    ) {
    }
}